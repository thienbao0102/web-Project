const express = require('express')
const bodyParser = require('body-parser');
const controllerDetail = require('./controllers/controllers')

const app = express()
const port = 3000

app.use(express.static('public/images'));
app.use(express.static('public/pages/stylesheets'));
//app.use(express.static('public/pages/scipts'));
//app.use(express.static('public/images/svg'));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

/*------------Route------------*/
app.get('/', async (req, res) =>{
    res.sendFile(__dirname + '/public/pages/index.html');
})



/*------------API------------*/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))