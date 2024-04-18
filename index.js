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

/*------------Route------------*/
app.get('/', async (req, res) =>{
    res.sendFile(__dirname + '/public/pages/index.html');
})

    //dashboard page
app.get('/dashboard', async (req, res) =>{
    res.sendFile(__dirname + '/public/pages/dashboard.html');
})

    //manage page
app.get('/manage', (req,res)=> res.sendFile(__dirname + '/public/pages/manage.html'))

    //page my info
app.get('/myinfo', (req,res)=> res.sendFile(__dirname + '/public/pages/myInfo.html'))

    //products page
app.get('/products', (req,res)=> {
    res.sendFile(__dirname + '/public/pages/products.html');
})
    //cart page
app.get('/cart', (req,res)=> {
    res.sendFile(__dirname + '/public/pages/cart.html');
})

    //page login and register
app.get('/login_orregister', (req,res)=> res.sendFile(__dirname + '/public/pages/login_register.html'))

/*------------API------------*/

//search
app.post(`/api/searchProduct`,async(req,res)=>{
    list = await controllers.querySearchProduct(req.body)
    console.table(list.dt);
    res.json({
        dt: list.dt,
        ms: list.ms,
        st: list.st
    })
})


    //get all products
app.get('/api/getAllProducts', async (req,res)=> {
    try{
        const products = await controllerDetails.getAllShoes();
        if (products.length < 1) {
            res.status(404).json({ error: 'Không tìm thấy' });
        } else {
            res.json({products:products}, {message: "Success!"}, {status: 200});
        }
    }catch(err) {
        console.error('An error occurred while processing the request:', err);
        res.status(500).json({ error: 'Internal server error'});
    }
})

app.get(`*`,(req,res)=>
{
    res.sendFile(__dirname + '/public/pages/404-page.html');
})

process.on('SIGINT', ()=>{
    controllerDetails.closeConnectToDatabase()
})
app.listen(port, () => console.log(`Stride sync is running on http://localhost:${port}`))