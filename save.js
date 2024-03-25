// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./voitureModel');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  const voitures = {
    '488 GTB': { qty: 3, price: 3000},
    'F40': { qty: 2, price: 10000},
    'Huracan': { qty: 4, price: 3000},
    'Avantador': { qty: 3, price: 3000},
    '911': { qty: 5, price: 1500},
    'GT3 rs': { qty: 4, price: 2000},
    'M4': { qty: 6, price: 800},
    'X5': { qty: 6, price: 800},
  }

  for (voiture_name in voitures) {
    await db.createVoiture(voiture_name, voitures[voiture_name].qty, voitures[voiture_name].price);
  }

  // Read
  const getAllVoitures = await db.getAllVoitures();
  console.log('Tous les voitures :', getAllVoitures);
}

main().catch(err => console.error(err));
