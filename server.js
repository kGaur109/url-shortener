const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrls');
const app = express();

mongoose
	.connect('mongodb://localhost/urlShortener', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('mongodb is running');
	})
	.catch((err) => {
		console.log('mongodb error \n', err);
	});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res) => {
	const shortUrls = await ShortUrl.find().sort({clicks: -1, createdAt: -1});
	res.render('index', {shortUrls: shortUrls});
});

app.post('/shortUrls', async (req, res) => {
	await ShortUrl.create({urlLabel: req.body.label, full: req.body.fullUrl});
	res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
	const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
	if (!shortUrl) {
		res.sendStatus(404);
	}
	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 1337, () => {
	console.log('server running on port 1337');
});
