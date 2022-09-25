const mongoose = require('mongoose')

const mongoURL = "mongodb://localhost:27017"
module.exports = async () => {
    await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology : true
    })

    return mongoose
}