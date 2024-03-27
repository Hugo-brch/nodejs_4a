// voitureModel.js

const knex = require('knex')(require('../knexfile')['development']);

// Create
async function createVoiture(name, quantity, price, brandId) {
  return await knex('voitures').insert({ name, quantity, price, brand_id: brandId });
}

// Read
async function getAllVoitures() {
  return await knex.select().from('voitures');
}

async function getVoituresByBrand(brandName) {
  const brand = await knex('brands').where({ name: brandName }).first();
  console.log(brand, brandName)
  return await knex.select().from('voitures').where({ brand_id: brand.id});
  // return await knex('voitures').whereExists(function() {
  //   this.select('*').from('brands').whereRaw('brands.id = voitures.brand_id').andWhere('brands.name', brandName);
  // });
}

async function getVoitureById(id) {
  return await knex('voitures').where({ id }).first();
}

// Update
async function updateVoiture(id, updates) {
  return await knex('voitures').where({ id }).update({ quantity: updates });
}


// Delete
async function deleteVoiture(id) {
  return await knex('voitures').where({ id }).del();
}

module.exports = {
  createVoiture,
  getAllVoitures,
  getVoituresByBrand,
  getVoitureById,
  updateVoiture,
  deleteVoiture
};
