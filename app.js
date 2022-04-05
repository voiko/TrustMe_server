app = require('./server')
const mongoose = require('mongoose')

const port = process.env.PORT;
const uri = process.env.ATLAS_URI

// const userRoutes = require('./routes/user');

app.listen(port, async (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server is up and listenning on port ${port}, connecting to mongoDB...`);
    try {
        //mongodb atlas
        const connection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('connected to mongoose successfully!')
    } catch (err) {
        console.log('failed to connect to mongoose' + err.message);
    }
})