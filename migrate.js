const knex = require('knex')(require('./knexfile')['development']);

async function createTable() {
  try {
    const exists = await knex.schema.hasTable('voitures');
    if (!exists) {
      await knex.schema.createTable('voitures', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('price');
        table.integer('quantity');
      });
      console.log('La table "voitures" a été créée avec succès.');
    } else {
      console.log('La table "voitures" existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la table :', error);
  } finally {
    await knex.destroy();
  }
}

createTable();