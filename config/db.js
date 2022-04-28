const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/backendAPI',{
 
    useNewUrlParser: true,
    useUnifiedTopology: true ,
  
}).then(()=>{
    console.log(`Database Connected Successfully....`);
}).catch((e)=>{
    console.log(e)
}) 