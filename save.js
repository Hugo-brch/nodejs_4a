// App.js - Utilisation des opérations CRUD avec Knex

const db = require('./Models/voitureModel');

async function main() {
    const voitures = {
        '488 GTB': { qty: 3, price: 3000, brand: "Ferrari" },
        'Ferrari': { qty: 2, price: 10000, brand: "Ferrari" },
        'Huracan': { qty: 4, price: 3000, brand: "Lamborghini" },
        'Avantador': { qty: 3, price: 3000, brand: "Lamborghini" },
        '911': { qty: 5, price: 1500, brand: "Porsche" },
        'GT3 rs': { qty: 4, price: 2000, brand: "Porsche" },
        'M4': { qty: 6, price: 800, brand: "BMW" },
        'X5': { qty: 6, price: 800, brand: "BMW" },
    };

    for (const voitureName in voitures) {
        await db.createVoiture(voitureName, voitures[voitureName].qty, voitures[voitureName].price);
    }

    // Read
    const getAllVoitures = await db.getAllVoitures();
    console.log('Toutes les voitures :', getAllVoitures);
}

main().catch(err => console.error(err));
