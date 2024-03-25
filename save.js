// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./voitureModel');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function main() {
  const voitures = {
    'captain_morgan': { qty: 10, price: 30},
    'barcadi': { qty: 19, price: 10},
    'old_nick': { qty: 5, price: 30},
  }

  for (voiture_name in voitures) {
    await db.createVoiture(voiture_name, voitures[voiture_name].qty, voitures[voiture_name].price);
  }

  // Read
  const getAllVoitures = await db.getAllVoitures();
  console.log('Tous les voitures :', getAllVoitures);
}

main().catch(err => console.error(err));
