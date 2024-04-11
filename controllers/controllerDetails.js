const MongoClient = require('mongodb').MongoClient;
const urlConnect = 'mongodb://localhost:27017'
const nameDB = 'MyDatabase';
const nameCollection = 'shoes';
let client;
let shoes;

//connect to Database
async function connecToDatabase()
{
    try {
        client = await MongoClient.connect(url);
        shoes = client.db(nameDB).collection(nameCollection);
        console.log("Connect success!");
    } catch (error) {
        console.log("connect failed!");
        console.error("error: " + error);
    }
}

