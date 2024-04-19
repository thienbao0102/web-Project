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
async function createId(){
    const list = await search({},'users');
    maxId = 0;
    for(i = 0; i < list.dt.length ; i++){
        const userId = parseInt(list.dt[i]._id.substring(4));
        if(userId > maxId){
            maxId = userId;
        }
    }
    const newId = 'USER' + String(maxId + 1).padStart(4,'0');
    return newId;
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
async function update(query, updateFields) {
    try {
        const result = await db.collection(nameCollection).updateMany(query, { $set: updateFields });
        console.log(result.modifiedCount + " documents updated successfully.");
        return {
            message: 'success',
            status: 200,
            data: result
        };
    } catch (error) {
        console.error("Error updating documents: ", error);
        return {
            message: 'failed',
            status: 500,
            error: error
        };
    }
}
module.exports ={
    connecToDatabase, closeConnectToDatabase, getAllShoes,search, update
}
