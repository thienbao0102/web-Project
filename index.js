const express = require('express')
const bodyParser = require('body-parser');
const controllers = require('./controllers/controllers')
const controllerDetails = require('./controllers/controllerDetails')

const app = express()
const port = 3000

app.use(express.static('public'));
//app.use(express.static('public/pages/scipts'));
//app.use(express.static('public/images/svg'));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//khai bao dung public cho folder public
app.use(express.static('public/images'))

//ket noi database
controllerDetails.connecToDatabase();

process.on('SIGINT', ()=>{
    controllerDetails.closeConnectToDatabase()
})

/*------------Route------------*/
app.get('/', async (req, res) =>{
    res.sendFile(__dirname + '/public/pages/index.html');
})

    //page my info
app.get('/myinfo', (req,res)=> res.sendFile(__dirname + '/public/pages/myInfo.html'))

    //page login and register
app.get('/login_orregister', (req,res)=> res.sendFile(__dirname + '/public/pages/login_register.html'))

/*------------API------------*/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))