const controllerDetails = require('./controllerDetails')
//ten collection
const admin = 'admins';
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
        if (rawData.name) { //name /id
            query.name = { $regex: rawData.name, $options: 'i' }
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
        else if (!rawData.minPrice && rawData.maxPrice){ //Min == null, max != null -> X < max
            query.price = {
                $lt: parseFloat(rawData.maxPrice) + 1
            }
        } 

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
async function updateShoes(shoes, updateFields) {
    try {
        let shoesToUpdate = await querySearchProduct(shoes);
        const setUpdateField = {};

        // Kiểm tra và thiết lập các trường cần cập nhật
        if (updateFields.name !== null && updateFields.name !== '') {
            setUpdateField.name = updateFields.name;
        }
        if (updateFields.size !== null && updateFields.size !== '') {
            setUpdateField.size = updateFields.size;
        }
        if (updateFields.price !== null && updateFields.price !== '') {
            setUpdateField.price = updateFields.price;
        }
        if (updateFields.quantity !== null && updateFields.quantity !== '') {
            setUpdateField.quantity = updateFields.quantity;
        }

        // Tiến hành cập nhật
        const result = await controllerDetails.update({ $or: shoesToUpdate.dt },setUpdateField);

        // Trả về số lượng bản ghi đã được cập nhật thành công
        console.log(result.modifiedCount + " shoes updated successfully.");
        return {
            data: result.modifiedCount,
            message: 'Update successful!',
            status: 200
        };
    } catch (error) {
        console.error("Error updating shoes: ", error);
        return {
            data: '',
            message: 'Update failed!',
            status: -1
        };
    }
}
//query to login
async function queryLogin(rawData){
    try {
        const query = {};
        query.email = {$regex: `^${rawData.email}$`, $options: 'i'};
        var user;
        var checkUser = false;
        //la user
        user = await controllerDetails.search(query, users);
        if(user.dt.length > 0){
            checkUser = await controllerDetails.checkPass(rawData.password, user.dt[0].password)    
        }    
        if(checkUser){
            console.log("check users " + checkUser);
            return{
                dt:user.dt[0]._id,
                ms:"user",
                st:0
            }
        }
        //la admin
        user = await controllerDetails.search(query, admin);
        if(user.dt.length > 0){
            checkUser = await controllerDetails.checkPass(rawData.password, user.dt[0].password)
        }
        if(checkUser){
            console.log("check users " + checkUser);
            return{
                dt:user.dt[0]._id,
                ms:"admin",
                st:1
            }
        }
        //khong co tai khoan
        return{
            dt:'',
            ms:"No Account",
            st: 2
        }

    } catch (error) {
        console.log("err: queryLogin " + error);
        return{
            dt:'',
            ms:"Failed",
            st:-1
        }
    }
}

//sign up
async function signUpNewAccount(rawData){
    try {
        //check email da ton tai chua
        const query = {};
        query.email = {$regex: rawData.email, $options: 'i'};
        const emailExits = await controllerDetails.search(query, users);
        if(emailExits.length > 0){
            console.log("da ton tai")
            return{
                dt:'',
                ms:'email was exits',
                st:1
            }
        }
        //hash pass
        const passHash = await controllerDetails.hashPassword(rawData.password);
        //create id
        const newId = await controllerDetails.createId('USER',users);
        console.log("new id: " + newId);
        const newUser = {
            '_id': newId,
            'name': rawData.name,
            'email':rawData.email,
            'gender': rawData.gender,
            'phone number': rawData.phone,
            'password': passHash
        }
        const result = await controllerDetails.createNewUser(newUser, users);
        return {
            dt: result.dt,
            ms: result.ms,
            st: result.st

        };
    } catch (error) {
        console.log("err: " + error);
        return{
            dt:'',
            ms:'Error',
            st: -1
        }
    }
    
}

module.exports = {
    querySearchProduct, queryLogin, signUpNewAccount,updateShoes
}