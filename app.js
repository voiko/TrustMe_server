const express = require('express');
const app = express();
const PORT = 3000;
const {
    dbConfig
} = require('./config/db');
// const userRoutes = require('./routes/user');
const mongoose = require('mongoose');

app.listen(PORT, async (err) => {
    if (err) {
        console.error(err);
        return;
    }
    try {
        const connection = await mongoose.connect(dbConfig.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Server and mongoDB is up!");
    } catch (err) {
        console.log(err);
    }
})