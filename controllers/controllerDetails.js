const bcrypt = require("bcrypt");
const MongoClient = require('mongodb').MongoClient;
const urlConnect = 'mongodb://localhost:27017';
const nameDB = 'ProjectWeb';
let client;
let db;
//connect to Database
async function connecToDatabase()
{
    try {
        client = await MongoClient.connect(urlConnect);
        db = client.db(nameDB);
        console.log("Connect success!");        
    } catch (error) {
        console.log("connect failed!");
        console.error("error: " + error);
        throw error;
    }
}

//close connect database
async function closeConnectToDatabase()
{
    if(client) {
        await client.close()
            .then (() => {
                console.log ('Mongo Database closed.');
                process.exit(0);
            })
            .catch (error => {
                console.error('Fail to close MongoDB connection error: ', error);
                process.exit(1);
            });
    }else {
        process.exit(0);
    }
}

//hash password
async function hashPassword(rawPass){
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(rawPass,salt);
    return passHash;
}

//check password
async function checkPass(passInput,passHash){
    const comparePass = await bcrypt.compare(passInput,passHash);
    return comparePass;
}

//create id
async function createId(str, nameCollection){
    const list = await search({},nameCollection);
    maxId = 0;
    for(i = 0; i < list.dt.length ; i++){
        const userId = parseInt(list.dt[i]._id.substring(str.length));
        if(userId > maxId){
            maxId = userId;
        }
    }
    const newId = str + String(maxId + 1).padStart(4,'0');
    return newId;
}

//get carts
async function getCartsFromDB(userId) {
    try {
        const carts = await search(userId, "carts");
        return{
            dt: carts.dt,
            ms: 'success',
            st: 0
        }
    } catch (error) {
        console.log("err: " + error);
        return{
            dt: '',
            ms: 'failed',
            st: -1
        }
    }
}

//updateProductCart
async function updateProductInCart(query, updateData, nameCollection) {
    try {
        const result = await db.collection(nameCollection).updateOne(query,updateData);
        return {
            ms: `${result.modifiedCount} document updated successfully.`,
            st: 0,
            dt: ''
        };
    } catch (error) {
        console.error("Error updating document: ", error);
        return {
            ms: 'Failed',
            st: -1,
            dt: ''
        };
    }
}

//search
async function search(query, nameCollection){
    try {
        const list = await db.collection(nameCollection).find(query).toArray();
        return{
            dt: list,
            ms: 'success',
            st: 0
        }
    } catch (error) {
        console.log("err: " + error);
        return{
            dt: '',
            ms: 'failed',
            st: -1
        }
    }
}
//get all shoes
async function getAllShoes(nameCollection) {
    try
    {
        const documents = await db.collection(nameCollection).find({}).toArray();
        return documents;
    } catch(err) {
        console.error("Error while pulling shoes. Error: ", err);
        throw err;
    }
}
//update
async function update(query, updateData, nameCollection) {
    try {
        const result = await db.collection(nameCollection).updateMany({_id:{$in: query}}, updateData);
        console.log(result.modifiedCount + " documents updated successfully.");
        return {
            ms: 'Update Success!',
            st: 0,
            dt: ''
        };
    } catch (error) {
        console.error("Error updating documents: ", error);
        return {
            ms: 'Failed',
            st: -1,
            dt: ''
        };
    }
}
//delete product
async function deleteProducts(query, nameCollection) {
    try {
        const result = await db.collection(nameCollection).deleteMany({_id: {$in: query}});
        console.log(result.deletedCount + " documents deleted successfully.");
        return {
            ms: 'Shoes deleted successfully',
            st: 0,
            dt: ''
        };
    } catch (error) {
        console.error("Error deleting documents: ", error);
        return {
            ms: 'Failed to delete shoes',
            st: 500,
            dt: ''
        };
    }
}

//create new object
async function createNewObj(query, nameCollection){
    try {
        result = await db.collection(nameCollection).insertOne(query);
        return{
            dt: '',
            ms: 'Create Success',
            st: 0
        }
        
    } catch (error) {
        console.log("err: " + error)
        return{
            dt: '',
            ms: 'Create Failed!',
            st: -1
        }
    }
}

//add to cart
async function addProductToCart(query, productQuery, nameCollection){
    try {
        const result = await db.collection(nameCollection).updateOne({_id: query}, productQuery);
        console.log(result.modifiedCount + " documents updated successfully.")
        return{
            dt: '',
            ms: 'Add to cart Success',
            st: 0
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

module.exports ={
    connecToDatabase, closeConnectToDatabase,hashPassword,checkPass,createId, getAllShoes,search
    , update, createNewObj,deleteProducts, addProductToCart, getCartsFromDB, updateProductInCart
}
