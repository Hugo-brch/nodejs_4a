const limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const db = require('./Models/voitureModel');

(async function() {

	const voitures = await db.getAllVoitures();
	console.log(voitures);
	// Tout d'abord, définissons notre type de classificateur de base (un classificateur multi-étiquettes basé sur Winnow) :
	var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
		binaryClassifierType: limdu.classifiers.Winnow.bind(0, {retrain_count: 10})
	});

	// Définissons maintenant notre extracteur de caractéristiques - une fonction qui prend un échantillon et ajoute des caractéristiques à un ensemble de caractéristiques donné :
	var WordExtractor = function(input, features) {
		input.split(" ").forEach(function(word) {
			features[word] = 1;
		});
	};

	// Initialiser un classificateur avec le type de classificateur de base et l'extracteur de caractéristiques :
	var intentClassifier = new limdu.classifiers.EnhancedClassifier({
		classifierType: TextClassifier,
		featureExtractor: WordExtractor
	});

	// Entraîner et tester :
	intentClassifier.trainBatch([
		{input: "ubbu", output: "Ferrari"},
		{input: "F40 Ferrari", output: "Ferrari"},
		{input: "Huracan Lamborghini", output: "Lamborghini"},
		{input: "Avantador Lamborghini", output: "Lamborghini"},
		{input: "911 Porsche", output: "Porsche"},
		{input: "GT3 rs Porsche", output: "Porsche"},
		{input: "M4 BMW", output: "BMW"},
		{input: "X5 BMW", output: "BMW"},
	]);


	// Initialiser un classificateur avec le type de classificateur de base et l'extracteur de caractéristiques :
	var intentClassifierAccept = new limdu.classifiers.EnhancedClassifier({
		classifierType: TextClassifier,
		featureExtractor: WordExtractor
	});

	// Entraîner et tester :
	intentClassifierAccept.trainBatch([
		{input: "Je veux bien cette voiture", output: "oui"},
		{input: "Donne moi !", output: "oui"},
		{input: "je prends", output: "oui"},
		{input: "ok", output: "oui"},
		{input: "je ne prends pas", output: "non"},
		{input: "Non c'est trop cher", output: "non"},
		{input: "Non je veux pas", output: "non"},
		{input: "Non sais pas !", output: "non"},
	]);

	console.log('Bonjour');
	const voiture_demandee = prompt("Pouvez-vous me dire la voiture que vous souhaitez (Ferrari, Lamborghini, Porsche, BMW) ?");
	const predicted_response = intentClassifier.classify(voiture_demandee);

	let voiture_actuelle = null;
	for (const voiture of voitures) {
		if (voiture.name === predicted_response[0]) {
			console.log("La voiture", voiture.name, "est de", voiture.price, " EUR");
			voiture_actuelle = voiture;
			break;
		}
	}

	const yesno = prompt(`Souhaitez-vous acheter cette ${voiture_actuelle.name} ?`);
	const predicted_response_accept = intentClassifierAccept.classify(yesno);
	if (predicted_response_accept[0] === 'non') {
		console.log('Merci et à la prochaine!');
	}

	if (predicted_response_accept[0] === 'oui') {

		const qty_demandee = prompt(`Combien de ${voiture_actuelle.name} souhaitez-vous ?`);
		console.log(`Vous voulez ${Number(qty_demandee)} ${voiture_actuelle.name}(s)`);
		const voiture_de_db = await db.getVoitureById(voiture_actuelle.id);
		if (voiture_de_db.quantity <= 0) {
			console.log(`Nous n'avons plus de ${voiture_de_db.name} !`);
		} else if ((voiture_de_db.quantity - Number(qty_demandee)) <= 0) {
			console.log(`Nous n'avons pas suffisamment de ${voiture_de_db.name} pour vous servir !`);
		} else {
			db.updateVoiture(voiture_actuelle.id, voiture_de_db.quantity - Number(qty_demandee));
			if (Number(qty_demandee) === 1) {
				console.log('Ok merci, prenez votre voiture !');
			} else {
				console.log('Ok merci, prenez vos voitures !');
			}
		}
	}

})();
