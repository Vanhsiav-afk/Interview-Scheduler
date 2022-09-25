const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');

const MONGO_URL = `mongodb://localhost:27017`

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
const PORT = 5000

app.use(bodyParser.json())
app.use(cors())

//ROUTES
const interviewRoute = require('./routes/interview');
const participantRoute = require('./routes/participant')

mongoose
    .connect(MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

app.use("/api/interviews", interviewRoute);
app.use("/api/participants",participantRoute)

app.listen(PORT,()=>{
    console.log("Server is connected!")
})