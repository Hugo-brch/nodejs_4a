const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createBrand(name) {
  return await knex('brands').insert({ name });
}

// Read
async function getAllBrands() {
  return await knex.select().from('brands');
}

async function getBrandById(id) {
  return await knex('brands').where({ id }).first();
}

// Update
async function updateBrand(id, updates) {
  return await knex('brands').where({ id }).update(updates);
}

// Delete
async function deleteBrand(id) {
  return await knex('brands').where({ id }).del();
}

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand
};
