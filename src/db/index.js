const mongoose = require('mongoose')

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    // .catch(e=> console.log(e))
    console.log(`MongoDB Connected!`)
}

module.exports = {
    connectDB
}