const { query } = require('express');
const controllerDetails = require('./controllerDetails')
//ten collection
const admin = 'admins';
const shoes = 'shoes';
const users = 'users';
const bills = 'bills';
const carts = 'carts';
//query to search product
async function querySearchProduct(rawData) {
    try {
        const query = {};
        if (rawData.idOrName) { //name /id
            query.$or = [
                { _id: { $regex: rawData.idOrName, $options: 'i' } },
                { name: { $regex: rawData.idOrName, $options: 'i' } }
            ];
        }
        if (rawData._id) { //name /id
            query._id = { $regex: rawData._id, $options: 'i' }
        }
        if (rawData.name) { //name /id
            query.name = { $regex: rawData.name, $options: 'i' }
        }
        if (rawData.price) { //price
            query.price = {
                $gte: parseFloat(rawData.price),
                $lt: parseFloat(rawData.price) + 1
            };
        }
        if (rawData.category) { //category
            let categories = rawData.category;
            if (typeof categories === 'string') {
                categories = categories.split(',').map(category => category.trim());
            }
            query.category = { $in: categories.map(category => new RegExp(category, 'i')) };
        }
        if (rawData.quantity) {     //quantity
            query.quantity = {
                $eq: parseInt(rawData.quantity)
            }
        }
        if (rawData.minPrice && rawData.maxPrice) { //Min != null, max != null ->min>= X < max
            query.price = {
                $gte: parseFloat(rawData.minPrice),
                $lt: parseFloat(rawData.maxPrice) + 1
            }
        }
        else if (rawData.minPrice && !rawData.maxPrice) { //Min != null, max == null -> X >= min
            query.price = {
                $gte: parseFloat(rawData.minPrice)
            }
        }
        else if (!rawData.minPrice && rawData.maxPrice) { //Min == null, max != null -> X < max
            query.price = {
                $lt: parseFloat(rawData.maxPrice) + 1
            }
        }
        if (rawData.isPopular === 'true') {
            query.isPopular = true
        }
        if (rawData.sale === 'true') {
            query.sale = {
                $gte: 1
            }
        }
        list = await controllerDetails.search(query, shoes);
        return {
            dt: list.dt,
            ms: list.ms,
            st: list.st
        }
    } catch (error) {
        console.log("err: " + error)
        return {
            dt: '',
            ms: 'Search failed!',
            st: -1
        }
    }
}
//query to login
async function queryLogin(rawData) {
    try {
        const query = {};
        query.email = { $regex: `^${rawData.email}$`, $options: 'i' };
        var user;
        var checkUser = false;
        //la user
        user = await controllerDetails.search(query, users);
        if (user.dt.length > 0) {
            checkUser = await controllerDetails.checkPass(rawData.password, user.dt[0].password)
        }
        if (checkUser) {
            console.log("check users " + checkUser);
            return {
                dt: user.dt[0]._id,
                ms: "user",
                st: 0
            }
        }
        //la admin
        user = await controllerDetails.search(query, admin);
        if (user.dt.length > 0) {
            checkUser = await controllerDetails.checkPass(rawData.password, user.dt[0].password)
        }
        if (checkUser) {
            console.log("check users " + checkUser);
            return {
                dt: user.dt[0]._id,
                ms: "admin",
                st: 1
            }
        }
        //khong co tai khoan
        return {
            dt: '',
            ms: "Error email or password",
            st: 2
        }

    } catch (error) {
        console.log("err: queryLogin " + error);
        return {
            dt: '',
            ms: "Failed",
            st: -1
        }
    }
}

//sign up
async function signUpNewAccount(rawData) {
    try {
        //check email da ton tai chua
        const query = {};
        query.email = { $regex: rawData.email, $options: 'i' };
        const emailExits = await controllerDetails.search(query, users);
        if (emailExits.length > 0) {
            console.log("da ton tai")
            return {
                dt: '',
                ms: 'email was exits',
                st: 1
            }
        }
        //hash pass
        const passHash = await controllerDetails.hashPassword(rawData.password);
        //create id
        const newId = await controllerDetails.createId('USER', users);
        console.log("new id: " + newId);
        const newUser = {
            '_id': newId,
            'name': rawData.name,
            'email': rawData.email,
            'gender': rawData.gender,
            'phone number': rawData.phone,
            'password': passHash
        }
        const result = await controllerDetails.createNewObj(newUser, users);
        //tạo giỏ hàng
        const queryCart ={
            '_id': newId,
            'item':{}
        };        
        const createCart = await controllerDetails.createNewObj(queryCart, carts);
        return {
            dt: result.dt,
            ms: result.ms,
            st: result.st
        };
    } catch (error) {
        console.log("err: " + error);
        return {
            dt: '',
            ms: 'Error',
            st: -1
        }
    }

}

//delete
async function deleteListProduct(rawData) {
    try {
        console.log(rawData);
        const result = await controllerDetails.deleteProducts(rawData, shoes);
        return {
            dt: result.dt,
            ms: result.ms,
            st: result.st
        }
    } catch (error) {
        console.log("Err: " + error);
        return {
            dt: '',
            ms: 'error',
            st: -1
        }
    }
}

async function updateCart(rawData) {
    try {
        let query = [];
        const userId = rawData._id;
        const productId = rawData.productId;
        const updateFields = {};

        query = { 
            _id: userId,
            [`item.${productId}`] : { $exists: true }
        };

        // Kiểm tra và thêm cập nhật cho quantity
        if (rawData.quantity) {
            updateFields.$set = updateFields.$set || {};
            updateFields.$set[`item.${productId}.quantity`] = rawData.quantity;
        }

        // Kiểm tra và thêm cập nhật cho size
        if (rawData.size) {
            updateFields.$set = updateFields.$set || {};
            updateFields.$set[`item.${productId}.size`] = rawData.size;
        }
        const result = await controllerDetails.updateProductInCart(query, updateFields, carts);
        return {
            st: result.st,
            ms: result.ms,
            dt: result.dt
        }
    } catch (error) {
        console.log("err: " + error);
        return {
            st: -1,
            ms: 'Failed',
            dt: ''
        }
    }
}

async function deleteProductCart(rawData) {
    try {
        let query = [];
        const userId = rawData._id;
        const productId = rawData.productId;

        query = { 
            _id: userId,
        };

        const updateFields = {
            $unset: {
                [`item.${productId}`]: ""
            }
        };

        const result = await controllerDetails.updateProductInCart(query, updateFields, carts);
        return {
            st: result.st,
            ms: result.ms,
            dt: result.dt
        }
    } catch (error) {
        console.log("err: " + error);
        return {
            st: -1,
            ms: 'Failed',
            dt: ''
        }
    }
}

//update
async function updateShoes(rawData, fileName) {
    try {
        const updateFields = {};
        var quantityForSize = JSON.parse(rawData.sizeQuantity);
        console.log('>>>File name: ' + fileName);
        const lisIds = rawData.listId.split(',');

        if (rawData.name) {
            updateFields.name = rawData.name;
        }
        if (rawData.price) {
            updateFields.price = rawData.price;
        }
        //check sale
        if (rawData.sale) {
            if (rawData.sale == 0) {
                updateFields.sale = false;
            }
            else {
                updateFields.sale = rawData.sale;
            }

        }
        //update quantity theo size
        if (quantityForSize.length > 0) {
            for (const item of quantityForSize) {
                updateFields[`sizes.${item.size}.quantity`] = parseInt(item.quantity);
            }
        }
        //check hinh anh
        if (fileName || fileName != '') {
            updateFields.imageURL = '/productPic/' + fileName;
        }
        //update popular 
        if (rawData.popular === 'true') {
            updateFields.isPopular = true;
        }
        else {
            updateFields.isPopular = false;
        }
        const updateData = { $set: updateFields };
        console.log(updateData);
        const result = await controllerDetails.update(lisIds, updateData, shoes);
        return {
            st: result.st,
            ms: result.ms,
            dt: result.dt
        }
    } catch (error) {
        console.log("err: " + error);
        return {
            st: -1,
            ms: 'Failed',
            dt: ''
        }
    }
}

//insert
async function insertProduct(rawData, fileName) {
    try {
        console.log(rawData);
        const insertData = {};
        const sizes = JSON.parse(rawData.sizes);
        const _id = await controllerDetails.createId('SHOE', shoes);
        console.log('>>>_id: ' + _id)
        //viet query
        insertData._id = _id;
        insertData.name = rawData.name;
        insertData.price = rawData.price;
        insertData.category = rawData.category;
        insertData.description = rawData.description;
        insertData.isPopular = rawData.popular;
        //sale
        if (rawData.sale === 0) {
            insertData.sale = false;
        }
        else {
            insertData.sale = rawData.sale;
        }
        //file anh
        if (fileName || fileName != '') {
            insertData.imageURL = '/productPic/' + fileName;
        }
        //size
        if (sizes.length > 0) {
            const sizeData = {}
            for (const [item, data] of Object.entries(sizes)) {
                sizeData[data.size] = { quantity: parseInt(data.quantity) };
            }
            insertData.sizes = sizeData
        }
        else {
            insertData.sizes = {};
        }

        console.log(insertData);
        const result = await controllerDetails.createNewObj(insertData, shoes)
        return {
            dt: result.dt,
            st: result.st,
            ms: result.ms
        }
    } catch (error) {
        console.log("Err: " + error)
        return {
            dt: '',
            st: -1,
            ms: 'Error'
        }
    }
}

//add to cart
async function addToCart(rawData) {
    try {
        //tìm gio hang của nguoi dùng 
        const query = {};
        query._id = rawData._id ;
        const mycart = await controllerDetails.search(query, carts);
        const lisIds = Object.keys(mycart.dt[0].item)
        var idItem = 0;

        if(lisIds)
            lisIds.sort((a, b) => (a < b ? 1 : -1));
            console.log(lisIds)
            idItem = parseInt(lisIds[0]) + 1;

        const prod = {};
        prod[`item.${idItem}.id`] = rawData.idProd;
        prod[`item.${idItem}.quantity`] = parseInt(rawData.quantity);
        prod[`item.${idItem}.size`] = rawData.size;

        const addProd = { $set: prod };
        const result = await controllerDetails.addProductToCart(rawData._id, addProd, carts)
        return {
            dt: result.dt,
            ms: result.ms,
            st: result.st
        }
    } catch (error) {
        console.log(error);
        return {
            dt: '',
            ms: 'error',
            st: -1
        }
    }
}
module.exports = {
    querySearchProduct, queryLogin, signUpNewAccount, updateShoes, deleteListProduct, insertProduct, addToCart, updateCart, deleteProductCart
}