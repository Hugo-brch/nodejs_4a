// App.js - Utilisation des opérations CRUD avec Knex
const dbVoiture = require('./Models/voitureModel');
const dbBrand = require('./Models/brandModel');
const dbClient = require('./Models/clientModel');
const dbOrder = require('./Models/orderModel');

// Fonction pour générer un ID unique
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

async function main() {
  const brands = [
    {
      name: 'Ferrari',
      voitures: {
        '488 GTB': { qty: 3, price: 3000 },
        'F40': { qty: 2, price: 10000 }
      }
    },
    {
      name: 'Lamborghini',
      voitures: {
        'Huracan': { qty: 4, price: 3000 },
        'Avantador': { qty: 3, price: 3000 }
      }
    },
    {
      name: 'Porsche',
      voitures: {
        '911': { qty: 5, price: 1500 },
        'GT3 RS': { qty: 4, price: 2000 }
      }
    },
    {
      name: 'BMW',
      voitures: {
        'M4': { qty: 6, price: 800 },
        'X5': { qty: 9, price: 1000 }
      }
    },
    {
      name: 'Audi',
      voitures: {
        'RS4': { qty: 5, price: 800 },
        'Q5': { qty: 3, price: 1500 }
      }
    }
  ];

  // Ajouter des clients
  const clients = [
    { firstName: 'John', lastName: 'Doe', age: 30 },
    { firstName: 'Jane', lastName: 'Smith', age: 25 }
  ];

  // Ajouter les commandes
  const orders = [
    { voitureId: '488 GTB', clientId: clients[0].id, quantity: 2 },
    { voitureId: '911', clientId: clients[1].id, quantity: 1 }
  ];

  const voitures_ids = [];
  for (const brand of brands) {
    const brand_record = await dbBrand.createBrand(brand.name);
    const voitures = brand.voitures;
    for (const voitureName in voitures) {
      const voiture = await dbVoiture.createVoiture(voitureName, voitures[voitureName].qty, voitures[voitureName].price, brand_record[0]);
      voitures_ids.push(voiture[0]);
    }
  }

  const clients_ids = [];
  for (const client of clients) {
    const client_record = await dbClient.createClient(client.firstName, client.lastName, client.age);
    clients_ids.push(client_record[0]);
  }

  console.info(clients_ids, voitures_ids);
  for (const order of orders) {
    await dbOrder.createOrder(voitures_ids[0], clients_ids[0], order.quantity);
  }

  // Lecture
  const getAllBrands = await dbBrand.getAllBrands();
  const getAllVoitures = await dbVoiture.getAllVoitures();
  const getAllClients = await dbClient.getAllClients();
  const getAllOrders = await dbOrder.getAllOrders();

  console.log('Toutes les marques :', getAllBrands);
  console.log('Toutes les voitures :', getAllVoitures);
  console.log('Tous les clients :', getAllClients);
  console.log('Toutes les commandes :', getAllOrders);
}

main().catch(err => console.error(err));
