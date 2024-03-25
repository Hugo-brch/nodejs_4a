const limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const dbVoiture = require('./Models/voitureModel');
const dbBrand = require('./Models/brandModel');
const dbClient = require('./Models/clientModel');
const dbOrder = require('./Models/orderModel');

(async function() {
    // Entraîner le classificateur pour reconnaître les marques de voitures
    const trainingDataBrands = [
        { input: "Ferrari", output: "Ferrari" },
        { input: "Lamborghini", output: "Lamborghini" },
        { input: "Porsche", output: "Porsche" },
        { input: "BMW", output: "BMW" },
        { input: "Audi", output: "Audi" },
        // Ajoutez ici d'autres marques avec leurs noms
    ];

    var brandClassifier = new limdu.classifiers.EnhancedClassifier({
        classifierType: limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
            binaryClassifierType: limdu.classifiers.Winnow.bind(0, { retrain_count: 10 })
        }),
        featureExtractor: function(input, features) {
            input.split(" ").forEach(function(word) {
                features[word] = 1;
            });
        }
    });
    brandClassifier.trainBatch(trainingDataBrands);

    // Demander la marque de la voiture
    const marque = prompt("Quelle marque de voiture recherchez-vous ? ");

    // Afficher les modèles de voitures disponibles pour la marque choisie
    const voitures = await dbVoiture.getVoituresByBrand(marque);
    console.log(`Voici les modèles de voitures disponibles pour la marque ${marque}:`);
    console.log(voitures)
    voitures.forEach(voiture => console.log(voiture.name));

    // Demander le modèle de voiture
    const modele = prompt("Quel modèle de voiture souhaitez-vous ? ");

    // Classer la marque de voiture sélectionnée
    const predictedBrand = brandClassifier.classify(modele);

    // Trouver les détails de la voiture sélectionnée
    const selectedVoiture = voitures.find(voiture => voiture.name === modele);

    if (!selectedVoiture) {
        console.log(`Désolé, le modèle ${modele} n'est pas disponible.`);
        return;
    }

    console.log(`Voici les détails de la voiture sélectionnée :`);
    console.log(`Nom: ${selectedVoiture.name}`);
    console.log(`Prix: ${selectedVoiture.price} EUR`);
    console.log(`Quantité en stock: ${selectedVoiture.quantity}`);

    // Demander à l'utilisateur s'il souhaite acheter la voiture
    const response = prompt(`Voulez-vous acheter la ${selectedVoiture.name} ? (oui/non) `);

    if (response.toLowerCase() === 'oui') {
        const quantity = prompt(`Combien de ${selectedVoiture.name} souhaitez-vous acheter ? `);

        // Vérifier si la quantité demandée est disponible en stock
        if (quantity > selectedVoiture.quantity) {
            console.log(`Désolé, nous n'avons pas assez de ${selectedVoiture.name} en stock.`);
            return;
        }

        // Demander les informations du client
        const firstName = prompt("Entrez votre prénom : ");
        const lastName = prompt("Entrez votre nom : ");
        const age = prompt("Entrez votre âge : ");

        // Ajouter le client à la base de données
        const clientId = await dbClient.createClient(firstName, lastName, age);

        // Ajouter la commande à la base de données
        await dbOrder.createOrder(selectedVoiture.id, clientId, quantity);

        // Mettre à jour la quantité de la voiture en stock
        await dbVoiture.updateVoiture(selectedVoiture.id, selectedVoiture.quantity - quantity);

        console.log(`Merci pour votre achat de ${quantity} ${selectedVoiture.name}(s) !`);
    } else {
        console.log('Merci et à bientôt !');
    }
})();
