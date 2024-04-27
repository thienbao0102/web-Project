const express = require('express');
const multer  = require('multer');
const bodyParser = require('body-parser');
const controllers = require('./controllers/controllers');
const controllerDetails = require('./controllers/controllerDetails');

const app = express()
const port = 3000

app.use(express.static('public'));
//app.use(express.static('public/pages/scipts'));
//app.use(express.static('public/images/svg'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//khai bao dung public cho folder public
app.use(express.static('public/images'))

// upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './public/images/productPic');
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

//ket noi database
controllerDetails.connecToDatabase();

/*------------Route------------*/
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/pages/index.html');
})

//dashboard page
app.get('/dashboard', async (req, res) => {
    res.sendFile(__dirname + '/public/pages/dashboard.html');
})

//manage page
app.get('/manage', (req, res) => res.sendFile(__dirname + '/public/pages/manage.html'))

//page my info
app.get('/myinfo', (req, res) => res.sendFile(__dirname + '/public/pages/myInfo.html'))

//products page
app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/public/pages/products.html');
})
//cart page
app.get('/my-cart', (req, res) => {
    res.sendFile(__dirname + '/public/pages/cart.html');
})

//page login and register
app.get('/login_orregister', (req, res) => res.sendFile(__dirname + '/public/pages/login_register.html'))

//productDetail
app.get('/product', async (req, res) => {
    res.sendFile(__dirname + '/public/pages/productDetail.html')
})

app.get('/contact', async (req, res) => {
    res.sendFile(__dirname + '/public/pages/form.html')
})

/*------------API------------*/

//login
app.post('/api/login', async (req, res) => {
    const list = await controllers.queryLogin(req.body);
    res.json({
        dt: list.dt,
        ms: list.ms,
        st: list.st
    })
})

//api signup
app.post('/api/SignUp', async (req, res) => {
    const result = await controllers.signUpNewAccount(req.body);
    res.json({
        dt: result.dt,
        ms: result.ms,
        st: result.st
    })
})

//search
app.get('/api/searchProduct', async (req, res) => {
    try {
        const data = req.query;
        const products = await controllers.querySearchProduct(data);
        if (products.length < 1) {
            products.ms = 'Not found';
        }
        res.json({
            dt: products.dt,
            ms: products.ms,
            st: products.st
        })

    } catch (err) {
        console.error('An error occurred while processing the request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/indexSearch', async (req, res) => {
    try{
        const data = req.query;
        const products = await controllers.querySearchProduct(data);
        if (products.length < 1) {
            res.status(404).json({ error: 'Không tìm thấy' });
        } else {
            res.json({
                dt: products.dt,
                ms: products.ms,
                st: products.st
            })
        }
    }catch(err) {
        console.error('An error occurred while processing the request:', err);
        res.status(500).json({ error: 'Internal server error'});
    }
});

//get all products
app.get('/api/getAllProducts', async (req, res) => {
    try {
        const products = await controllerDetails.getAllShoes("shoes");
        if (products.length < 1) {
            res.status(404).json({ error: 'Không tìm thấy' });
        } else {
            res.json({ products: products }, { message: "Success!" }, { status: 200 });
        }
    } catch (err) {
        console.error('An error occurred while processing the request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.put('/api/updateShoes',upload.single('file') ,async (req, res) => {
    var filename = '';
    if(req.file)
    {
        filename = req.file.filename
    }
    console.log('>>>File name: '+ filename);
    console.log(req.body);
    const result = await controllers.updateShoes(req.body, filename);
    res.json({
        dt: result.dt,
        st: result.st,
        ms: result.ms
    })
});
app.delete('/api/delete', async (req, res) => {
    const result = await controllers.deleteListProduct(req.body);
    res.json({
        dt: result.dt,
        ms: result.ms,
        st: result.st
    })
});


app.get(`*`, (req, res) => {
    res.sendFile(__dirname + '/public/pages/404-page.html');
})

process.on('SIGINT', () => {
    controllerDetails.closeConnectToDatabase()
})
app.listen(port, () => console.log(`Stride sync is running on http://localhost:${port}`))