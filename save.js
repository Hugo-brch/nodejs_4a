// App.js - Utilisation des opérations CRUD avec Knex
const db = require('./Models/voitureModel');

// Fonction pour générer un ID unique
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

async function main() {
    const voitures = {
        '488 GTB': { qty: 3, price: 3000, brand: "Ferrari" },
        'Ferrari': { qty: 2, price: 10000, brand: "Ferrari" },
        'Huracan': { qty: 4, price: 3000, brand: "Lamborghini" },
        'Avantador': { qty: 3, price: 3000, brand: "Lamborghini" },
        '911': { qty: 5, price: 1500, brand: "Porsche" },
        'GT3 rs': { qty: 4, price: 2000, brand: "Porsche" },
        'M4': { qty: 6, price: 800, brand: "BMW" },
        'X5': { qty: 6, price: 800, brand: "BMW" },
    };

  // Ajouter des clients
  const clients = [
    { id: generateUniqueId(), firstName: 'John', lastName: 'Doe', age: 30 },
    { id: generateUniqueId(), firstName: 'Jane', lastName: 'Smith', age: 25 }
  ];

  // Ajouter les commandes
  const orders = [
    { id: generateUniqueId(), voitureId: '488 GTB', clientId: clients[0].id, quantity: 2 },
    { id: generateUniqueId(), voitureId: '911', clientId: clients[1].id, quantity: 1 }
  ];

  for (const voitureName in voitures) {
    await db.createVoiture(voitureName, voitures[voitureName].qty, voitures[voitureName].price);
  }

  for (const client of clients) {
    await db.createClient(client.id, client.firstName, client.lastName, client.age);
  }

  for (const order of orders) {
    await db.createOrder(order.id, order.voitureId, order.clientId, order.quantity);
  }

  // Lecture
  const getAllVoitures = await db.getAllVoitures();
  const getAllClients = await db.getAllClients();
  const getAllOrders = await db.getAllOrders();

  console.log('Toutes les voitures :', getAllVoitures);
  console.log('Tous les clients :', getAllClients);
  console.log('Toutes les commandes :', getAllOrders);
}

main().catch(err => console.error(err));
