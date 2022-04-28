const express = require('express');
const app = express();
const registerRouter = require('./routes/register');
require('dotenv').config();
const port = process.env.PORT;

app.use(express.json())
app.use('/api',registerRouter)

app.listen(port,()=>{
    console.log(`Server is running at port no ${port}`)
})