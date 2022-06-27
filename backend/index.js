const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const app = express();



dotenv.config();
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.MONGO_URL , {useNewUrlParser:true},()=>{
  console.log("Connected to MongoDb")
});

app.use('/api/auth' , require('./routes/auth'));
app.use('/api/notes' , require('./routes/Notes'));

app.listen(3000, () => console.log('Server ready 3000'))

