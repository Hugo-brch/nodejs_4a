const limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const db = require('./Models/voitureModel');

(async function() {
    const voitures = await db.getAllVoitures();
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

<<<<<<< Updated upstream
    const voitureName = prompt("Quelle voiture souhaitez-vous ? ");
    const predictedBrand = brandClassifier.classify(voitureName)[0];
=======
	// Entraîner et tester :
	intentClassifier.trainBatch([
		{input: "488 GTB", output: "Ferrari"},
		{input: "F40 Ferrari", output: "Ferrari"},
		{input: "Huracan Lamborghini", output: "Lamborghini"},
		{input: "Avantador Lamborghini", output: "Lamborghini"},
		{input: "911 Porsche", output: "Porsche"},
		{input: "GT3 rs Porsche", output: "Porsche"},
		{input: "M4 BMW", output: "BMW"},
		{input: "X5 BMW", output: "BMW"},
	]);
>>>>>>> Stashed changes

    let currentVoiture = null;
    for (const voiture of voitures) {
        if (voiture.name === predictedBrand) {
            console.log(`La voiture ${voiture.name} est à ${voiture.price} EUR`);
            currentVoiture = voiture;
            break;
        }
    }

    if (currentVoiture) {
        const userResponse = prompt(`Voulez-vous acheter la ${currentVoiture.name} ? (oui/non) `);
        const predictedResponse = userResponse.toLowerCase().trim();

        if (predictedResponse === 'oui') {
            const quantity = prompt(`Combien de ${currentVoiture.name} voulez-vous acheter ? `);
            console.log(`Vous souhaitez acheter ${quantity} ${currentVoiture.name}(s)`);

            const voitureFromDb = await db.getBoisonById(currentVoiture.id);

            if (voitureFromDb && voitureFromDb.quantity > 0 && (voitureFromDb.quantity - quantity) >= 0) {
                await db.updateVoiture(currentVoiture.id, voitureFromDb.quantity - quantity);
                console.log(`Merci pour votre achat de ${quantity} ${currentVoiture.name}(s) !`);
            } else {
                console.log(`Désolé, nous n'avons pas assez de ${currentVoiture.name} en stock !`);
            }
        } else {
            console.log('Merci et à bientôt !');
        }
    } else {
        console.log(`Désolé, nous ne disposons pas de ${predictedBrand} dans notre stock.`);
    }
})();
