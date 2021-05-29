const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

//Seteamos la vista
app.set('view engine', 'ejs')

//Decirle a nuestra app que estamos usando urls
app.use(express.urlencoded({ extended: false}))


//Página principal
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls})
})

//En esta parte conectamos a la base de datos y guardamos nuestros links
app.post('/shortsUrls', async (req, res) => {
    //Creamos una nueva url
     await ShortUrl.create({ full: req.body.fullUrl })
    //Cuando se crea lo llevamos al inicio de la página
    res.redirect('/')
})

//Para el id corto
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    //Verificamos si el url no existe
    if( shortUrl == null ) return res.sendStatus(404)
    //Aumentamos la cantidad de clicks que vamos clickeando
    shortUrl.clicks++
    //Guardamos los datos en mongdb
    shortUrl.save()
    //Redireccionamos nuestro usuario a nuestra full URL
    res.redirect(shortUrl.full)
})

app.listen(5000)