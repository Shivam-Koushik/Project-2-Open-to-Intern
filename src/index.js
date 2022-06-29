const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://ShivamKoushik:s%40H9663334444@cluster0.k1qkf.mongodb.net/group70Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("mongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/functionup/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
