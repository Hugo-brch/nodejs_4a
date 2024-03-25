// voitureModel.js

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createVoiture(name, quantity, price, brand_id) {
  return await knex('voitures').insert({ name, quantity, price, brand_id });
}
// Read
async function getAllVoitures() {
  return await knex.select().from('voitures');
}

async function getVoitureById(id) {
  return await knex('voitures').where({ id }).first();
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
  getAllVoitures,
  getVoitureById,
  updateVoiture,
  deleteVoiture
};