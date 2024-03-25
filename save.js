// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./boissonModel');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  const boissons = {
    '488 GTB': { qty: 3, price: 3000},
    'F40': { qty: 2, price: 10000},
    'Huracan': { qty: 4, price: 3000},
    'Avantador': { qty: 3, price: 3000},
    '911': { qty: 5, price: 1500},
    'GT3 rs': { qty: 4, price: 2000},
    'M4': { qty: 6, price: 800},
    'X5': { qty: 6, price: 800},
  }

  for (boisson_name in boissons) {
    await db.createBoisson(boisson_name, boissons[boisson_name].qty, boissons[boisson_name].price);
  }

  // Read
  const getAllBoissons = await db.getAllBoissons();
  console.log('Tous les boissons :', getAllBoissons);
}

main().catch(err => console.error(err));
