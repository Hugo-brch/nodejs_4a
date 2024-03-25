// commandeModel.js

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createOrder(id, voitureId, clientId, quantity) {
  return await knex('orders').insert({ id, voitureId, clientId, quantity });
}

// Read
async function getAllOrders() {
  return await knex.select().from('orders');
}

async function getOrderById(id) {
  return await knex('orders').where({ id }).first();
}

// Update
async function updateOrder(id, updates) {
  return await knex('orders').where({ id }).update(updates);
}

// Delete
async function deleteOrder(id) {
  return await knex('orders').where({ id }).del();
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};
