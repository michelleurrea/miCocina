require('dotenv').config();
var express = require('express');
var app = express();
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
const axios = require('axios');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.get('/', (req, res) => {
	res.render('home');
})

app.post('/results', (req, res) => {
	let q = req.body.recipe;
	let app_key = process.env.APP_KEY;
	let app_id = process.env.APP_ID;
	let url = `https://api.edamam.com/search?q=${q}&app_id=${app_id}&app_key=${app_key}`;
	
	axios.get(url)
	.then(response => {
		//console.log(response.data.hits);
		var recipeResults = response.data.hits;

		let recipes = recipeResults.map(results => {
			let label = results.recipe.label;
			let image = results.recipe.image;
			let url = results.recipe.url;
			let serving = results.recipe.yield;
		
			return {
				label,
				image,
				url,
				serving
			}
		})
		res.render('results', {recipes});
	})
	.catch(error => {
		if(error){
			console.log(error);
			res.send("There was an error processing your request");
		}
	})
});

app.get('/profile/index', (req, res) => {
	res.render('./profile/index');
})

app.listen(8000);