const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const doctorsRouter = require('./routes/doctors')
const cors = require('cors')


app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected To MongoDB.'))
    .catch((error) => console.error('MongoDB connection error:', error))


//Routes
app.use('/api', doctorsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});