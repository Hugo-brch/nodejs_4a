// voitureModel.js

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createVoiture(name, quantity, price) {
  return await knex('voitures').insert({ name, quantity, price });
}

async function createClient(id, firstName, lastName, age) {
  return await knex('clients').insert({ id, firstName, lastName, age });
}

async function createOrder(id, voitureId, clientId, quantity) {
  return await knex('orders').insert({ id, voitureId, clientId, quantity });
}

// Read
async function getAllVoitures() {
  return await knex.select().from('voitures');
}

async function getAllClients() {
  return await knex.select().from('clients');
}

async function getAllOrders() {
  return await knex.select().from('orders');
}

async function getVoitureById(id) {
  return await knex('voitures').where({ id }).first();
}

async function getClientById(id) {
  return await knex('clients').where({ id }).first();
}

async function getOrderById(id) {
  return await knex('orders').where({ id }).first();
}

// Update
async function updateVoiture(id, quantity) {
  return await knex('voitures').where({ id }).update({ quantity });
}

// Delete
async function deleteVoiture(id) {
  return await knex('voitures').where({ id }).del();
}

module.exports = {
  createVoiture,
  createClient,
  createOrder,
  getAllVoitures,
  getAllClients,
  getAllOrders,
  getVoitureById,
  getClientById,
  getOrderById,
  updateVoiture,
  deleteVoiture
};