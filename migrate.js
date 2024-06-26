const knex = require('knex')(require('./knexfile')['development']);

async function createTables() {
  try {
        // Vérifier si la table "brands" existe
        const brandTableExists = await knex.schema.hasTable('brands');
        if (!brandTableExists) {
          await knex.schema.createTable('brands', table => {
            table.increments('id').primary();
            table.string('name');
          });
          console.log('La table "brands" a été créée avec succès.');
        } else {
          console.log('La table "brands" existe déjà.');
        }

    // Vérifier si la table "voitures" existe
    const voituresTableExists = await knex.schema.hasTable('voitures');
    if (!voituresTableExists) {
      await knex.schema.createTable('voitures', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('price');
        table.integer('quantity');
        table.integer('brand_id');
      });
      console.log('La table "voitures" a été créée avec succès.');
    } else {
      console.log('La table "voitures" existe déjà.');
    }

    // Créer la table "clients"
    const clientsTableExists = await knex.schema.hasTable('clients');
    if (!clientsTableExists) {
      await knex.schema.createTable('clients', table => {
        table.increments('id').primary();
        table.string('firstName');
        table.string('lastName');
        table.integer('age');
      });
      console.log('La table "clients" a été créée avec succès.');
    } else {
      console.log('La table "clients" existe déjà.');
    }

    // Créer la table "commandes"
    const OrdersTableExists = await knex.schema.hasTable('orders');
    if (!OrdersTableExists) {
      await knex.schema.createTable('orders', table => {
        table.increments('id').primary();
        table.integer('voitureId').references('id').inTable('voitures');
        table.integer('clientId').references('id').inTable('clients');
        table.integer('quantity');
      });
      console.log('La table "orders" a été créée avec succès.');
    } else {
      console.log('La table "orders" existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de la création des tables :', error);
  } finally {
    await knex.destroy();
  }
}

createTables();
