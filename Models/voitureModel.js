// db.js - Fichier pour gérer les opérations CRUD avec Knex

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createVoiture(name, quantity, price) {
  return await knex('voitures').insert({ name, quantity, price });
}

// Read
async function getAllVoitures() {
  return await knex.select().from('voitures');
}

async function getBoisonById(id) {
  return await knex('voitures').where({ id }).first();
}

// Update
async function updateVoiture(id, quantity) {
  return await knex('voitures').where({ id }).update({ quantity });
}

// Delete
async function deletVoiture(id) {
  return await knex('voitures').where({ id }).del();
}

module.exports = {
  createVoiture,
  getAllVoitures,
  getBoisonById,
  updateVoiture,
  deletVoiture
};

// npm install knex sqlite3