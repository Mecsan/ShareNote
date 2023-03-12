const mongo = require("mongoose");
mongo.set('strictQuery', true)
const connect = async () => {
    try {
        const data = await mongo.connect(process.env.MONGO_CONNECT);
        console.log("database connected")
    } catch (e) {
        console.log("couldn't connect with db" + e.message)
    }
}

connect();