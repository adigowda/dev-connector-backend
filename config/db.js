const mongoose = require('mongoose')
const config = require('./database.config')

const { url } = config

const connectDB = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB