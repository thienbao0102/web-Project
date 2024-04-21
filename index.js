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
app.get('/my-cart', (req,res)=> {
    res.sendFile(__dirname + '/public/pages/cart.html');
})

    //page login and register
app.get('/login', (req,res)=> res.sendFile(__dirname + '/public/pages/login_register.html'))

    //productDetail
app.get('/product', async(req,res)=>{
    res.sendFile(__dirname + '/public/pages/productDetail.html')
})

/*------------API------------*/

//search
app.post(`/api/searchProduct`, async(req,res)=>{
    const list = await controllers.querySearchProduct(req.body)
    res.json({
        dt: list.dt,
        ms: list.ms,
        st: list.st
    })
})

//login
app.post('/api/login', async(req,res)=>{
    const list = await controllers.queryLogin(req.body);
    res.json({
        dt: list.dt,
        ms: list.ms,
        st: list.st
    })
})

//api signup
app.post('/api/SignUp', async(req,res)=>{
    const result = await controllers.signUpNewAccount(req.body);
    res.json({
        dt: result.dt,
        ms: result.ms,
        st: result.st
    })
})
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
app.get('/api/getAllProducts', async (req,res)=> {
    try{
        const products = await controllerDetails.getAllShoes("shoes");
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
app.put('/api/updateShoes', async (req, res) => {
    try {
        const data = req.body; // Lấy dữ liệu từ body của request
        const updatedProduct = await controllers.updateShoes(data); // Gọi hàm updateProduct để cập nhật sản phẩm

        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: "Update successful" });
        }
    } catch (err) {
        console.error('Error processing the request:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/delete/:id', async (req, res) => {
    const shoesId = req.params.id;

    try {
        // Thực hiện tìm kiếm sản phẩm
        const searchResult = await controllers.querySearchProduct({ id: shoesId });

        // Kiểm tra nếu có kết quả từ việc tìm kiếm
        if (searchResult.dt) {
            // Lấy thông tin sản phẩm từ kết quả tìm kiếm
            const productId = searchResult.dt._id;

            // Thực hiện xóa sản phẩm
            const deleteResult = await controllerDetails.deleteId(productId);

            // Trả về kết quả xóa
            res.status(deleteResult.status).json(deleteResult);
        } else {
            // Không tìm thấy sản phẩm
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("Error deleting shoes: ", error);
        res.status(500).json({ message: 'Failed to delete shoes', error: error });
    }
});


app.get(`*`,(req,res)=>
{
    res.sendFile(__dirname + '/public/pages/404-page.html');
})

process.on('SIGINT', ()=>{
    controllerDetails.closeConnectToDatabase()
})
app.listen(port, () => console.log(`Stride sync is running on http://localhost:${port}`))