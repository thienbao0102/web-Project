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
        if (rawData.idOrName) { //name /id
            query.$or = [
                { _id: { $regex: rawData.idOrName, $options: 'i' } },
                { name: { $regex: rawData.idOrName, $options: 'i' } }
            ];
        }
        if(rawData.price){ //price
            query.price = {
                $gte: parseFloat(rawData.price),
                $lt: parseFloat(rawData.price) + 1
            };
        }
        if(rawData.category){ //category
            query.category = { $regex: rawData.category, $options: 'i' }
        }
        if (rawData.minPrice && rawData.maxPrice) { //Min != null, max != null ->min>= X < max
            query.price = {
                $gte: parseFloat(rawData.minPrice),
                $lt: parseFloat(rawData.maxPrice) + 1
            }
        }
        if (rawData.minPrice && !rawData.maxPrice) { //Min != null, max == null -> X >= min
            query.price = {
                $gte: parseFloat(rawData.minPrice)
            }
        }
        if (!rawData.minPrice && rawData.maxPrice){ //Min == null, max != null -> X < max
            query.price = {
                $lt: parseFloat(rawData.maxPrice) + 1
            }
        }
        if (rawData.quantity) {     //quantity
            query.quantity = {
                $eq: parseInt(rawData.quantity)
            }
        }
        console.log(query)

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