const limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const dbVoiture = require('./Models/voitureModel');
const dbBrand = require('./Models/brandModel');
const dbClient = require('./Models/clientModel');
const dbOrder = require('./Models/orderModel');

(async function() {
    // Chargement des données des voitures
    const voitures = await dbVoiture.getAllVoitures();
    console.log(voitures);

    // Définition du classificateur pour les marques de voitures
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

    // Entraînement du classificateur pour les marques de voitures
    var trainingDataBrands = [
        { input: "Ferrari", output: "Ferrari" },
        { input: "Lamborghini", output: "Lamborghini" },
        { input: "Porsche", output: "Porsche" },
        { input: "BMW", output: "BMW" }
    ];
    brandClassifier.trainBatch(trainingDataBrands);

    console.log('Bonjour');

    // Récupération du nom de la voiture souhaitée par l'utilisateur
    const voitureName = prompt("Quelle voiture souhaitez-vous ? ");

    // Prédiction de la marque de la voiture à partir du nom
    const predictedBrand = brandClassifier.classify(voitureName);
    console.log(`La marque prédite de la voiture "${voitureName}" est : ${predictedBrand}`);

    // Recherche de la voiture dans la base de données
    let currentVoiture = null;
    for (const voiture of voitures) {
        if (voiture.name === voitureName) {
            console.log(`La voiture ${voiture.name} est à ${voiture.price} EUR`);
            currentVoiture = voiture;
            break;
        }
    }

    // Si la voiture est trouvée dans la base de données
    if (currentVoiture) {
        const userResponse = prompt(`Voulez-vous acheter la ${currentVoiture.name} ? (oui/non) `);
        const predictedResponse = userResponse.toLowerCase().trim();

        if (predictedResponse === 'oui') {
            const quantity = prompt(`Combien de ${currentVoiture.name} voulez-vous acheter ? `);
            console.log(`Vous souhaitez acheter ${quantity} ${currentVoiture.name}(s)`);

            // Mise à jour de la quantité de la voiture dans la base de données
            const voitureFromDb = await dbVoiture.getVoitureById(currentVoiture.id);

            if (voitureFromDb && voitureFromDb.quantity > 0 && (voitureFromDb.quantity - quantity) >= 0) {
                await dbVoiture.updateVoiture(currentVoiture.id, voitureFromDb.quantity - quantity);
                console.log(`Merci pour votre achat de ${quantity} ${currentVoiture.name}(s) !`);
            } else {
                console.log(`Désolé, nous n'avons pas assez de ${currentVoiture.name} en stock !`);
            }
        } else {
            console.log('Merci et à bientôt !');
        }
    } else {
        console.log(`Désolé, nous ne disposons pas de ${voitureName} dans notre stock.`);
    }
})();
