const MongoClient = require('mongodb').MongoClient;
const urlConnect = 'mongodb://localhost:27017'
const nameDB = 'MyDatabase';
const nameCollection = 'shoes';
let client;
let db;

//connect to Database
async function connecToDatabase()
{
    try {
        client = await MongoClient.connect(urlConnect);
        db = client.db(nameDB).collection(nameCollection);
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

async function getAllShoes() {
    try
    {
        const documents = await db.find().toArray();
        return documents;
    } catch(err) {
        console.error("Error while pulling shoes. Error: ", err);
        throw err;
    }
}


module.exports ={
    connecToDatabase, closeConnectToDatabase, getAllShoes
}
