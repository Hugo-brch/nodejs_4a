var limdu = require('limdu');
const prompt = require("prompt-sync")({ sigint: true });
const db = require('./boissonModel');

(async function() {

	const boissons = await db.getAllBoissons()
	console.log(boissons)
	// First, define our base classifier type (a multi-label classifier based on winnow):
	var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
		binaryClassifierType: limdu.classifiers.Winnow.bind(0, {retrain_count: 10})
	});

	// Now define our feature extractor - a function that takes a sample and adds features to a given features set:
	var WordExtractor = function(input, features) {
		input.split(" ").forEach(function(word) {
			features[word]=1;
		});
	};

	// Initialize a classifier with the base classifier type and the feature extractor:
	var intentClassifier = new limdu.classifiers.EnhancedClassifier({
		classifierType: TextClassifier,
		featureExtractor: WordExtractor
	});

	// Train and test:
	intentClassifier.trainBatch([
		{input: { model : "488 GTB", brand : "Ferrari" }, output: "Ferrari"},
		{input: { model : "F40", brand : "Ferrari" }, output: "Ferrari"},
		{input: { model : "Huracan", brand : "Lamborgini" }, output: "Lamborgini"},
		{input: { model : "Avantador", brand : "Lamborgini" }, output: "Lamborgini"},
		{input: { model : "911", brand : "Porche" }, output: "Porche"},
		{input: { model : "GT3 rs", brand : "Porche" }, output: "Porche"},
		{input: { model : "M4", brand : "BMW" }, output: "BMW"},
		{input: { model : "X5", brand : "BMW" }, output: "BMW"},
	]);


	// Initialize a classifier with the base classifier type and the feature extractor:
	var intentClassifierAccept = new limdu.classifiers.EnhancedClassifier({
		classifierType: TextClassifier,
		featureExtractor: WordExtractor
	});

	// Train and test:
	intentClassifierAccept.trainBatch([
		{input: "Je veux bien cette boisson", output: "oui"},
		{input: "Donne moi !", output: "oui"},
		{input: "je prends", output: "oui"},
		{input: "ok", output: "oui"},
		{input: "je ne prends pas", output: "no"},
		{input: "Non c'est trop chère", output: "non"},
		{input: "Non je veux pas", output: "non"},
		{input: "Non sait pas !", output: "non"},
	]);



	console.log('Bonjour')
	const rhum_want = prompt("Pouvez-vous me dire le rhum que vous souhaitez (Nick, Barcardi, Morgan) possible ?");
	predicted_response = intentClassifier.classify(rhum_want);

	let current_boisson = null
	// console.log('predicted_response', predicted_response)
	for (boison of boissons) {
		if (boison.name == predicted_response[0]) {
			console.log("La boison", boison['name'], "est de", boison['price'], " EUR")
			current_boisson = boison 
			break
		}
	}

	const yesno = prompt(`Souhaitez-vous payer votre ${current_boisson.name} ?`);
	predicted_response = intentClassifierAccept.classify(yesno);
	if (predicted_response[0] == 'non') {
		console.log('Merci et à la prochaine!')
	}

	if (predicted_response[0] == 'oui') {

		const want_qty = prompt(`Avez-vous besoin de combien de ${current_boisson.name} ?`);
		console.log(`Vous voulez ${Number(want_qty)} ${current_boisson.name}(s)`)
		boisson_from_db = await db.getBoisonById(current_boisson.id)
		if ((boisson_from_db.quantity <= 0)) {
			console.log(`Nous n'avons plus de ${boisson_from_db.name}!`)
		} else if ((boisson_from_db.quantity - Number(want_qty)) <= 0) {
			console.log(`Nous n'avons pas suffisamment de ${boisson_from_db.name} pour vous servir!`)
		} else {
			db.updateBoisson(current_boisson.id, boisson_from_db.quantity - Number(want_qty))
			if (Number(want_qty) == 1) {
				console.log('Ok merci prennez votre boisson!')
			} else {
				console.log('Ok merci prennez vos boissons!')
			}
		}
	}

})()