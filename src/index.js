const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://ShivamKoushik:s%40H9663334444@cluster0.k1qkf.mongodb.net/Shivam4545-DB2?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen( 3000, function () {
    console.log('Express app running on port ' +  3000)
});
