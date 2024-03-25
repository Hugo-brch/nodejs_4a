// clientModel.js

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createClient(id, firstName, lastName, age) {
  return await knex('clients').insert({ id, firstName, lastName, age });
}

// Read
async function getAllClients() {
  return await knex.select().from('clients');
}

async function getClientById(id) {
  return await knex('clients').where({ id }).first();
}

// Update
async function updateClient(id, updates) {
  return await knex('clients').where({ id }).update(updates);
}

// Delete
async function deleteClient(id) {
  return await knex('clients').where({ id }).del();
}

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
