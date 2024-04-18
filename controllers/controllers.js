const controllerDetails = require('./controllerDetails')
//ten collection
const admin = 'admin';
const shoes = 'shoes';
const users = 'users';
const bills = 'bills';

//query to search product
async function querySearchProduct(rawData) {
    try {
        const query = {};
        if (rawData.idOrName) {
            query.$or = [
                { _id: { $regex: rawData.idOrName, $options: 'i' } },
                { name: { $regex: rawData.idOrName, $options: 'i' } }
            ];
            console.table(query)
            console.log(query)
        }
        if (rawData.minPrice && rawData.maxPrice) {
            query.price = {
                $gte: parseFloat(rawData.minPrice),
                $lte: parseFloat(rawData.maxPrice)
            }
        }
        else if (rawData.minPrice && !rawData.maxPrice) {
            query.price = {
                $gte: parseFloat(rawData.minPrice)
            }
        }
        else if (!rawData.minPrice && rawData.maxPrice){
            query.price = {
                $lte: parseFloat(rawData.maxPrice)
            }
        }

        if (rawData.quantity) {
            query.quantity = {
                $eq: parseInt(rawData.quantity)
            }
        }
        console.log(query);

        list = await controllerDetails.search(query,shoes);
        return{
            dt: list.dt,
            ms: list.ms,
            st: list.st
        }
    } catch (error) {
        console.log("err: " + error)
        return{
            dt: '',
            ms: 'Search failed!',
            st: -1
        }
    }
}
module.exports = {
    querySearchProduct
}