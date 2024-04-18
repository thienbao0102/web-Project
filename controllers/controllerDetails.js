const MongoClient = require('mongodb').MongoClient;
const urlConnect = 'mongodb://localhost:27017'
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

//search
async function search(query, nameCollection){
    try {
        const list = await db.collection(nameCollection).find(query).toArray();
        console.log(list);
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

module.exports ={
    connecToDatabase, closeConnectToDatabase, search
}
