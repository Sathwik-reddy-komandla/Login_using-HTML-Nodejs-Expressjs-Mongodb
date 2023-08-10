const mongoose=require('mongoose')

mongoose.connect(process.env.db)
    .then(()=>{
        console.log("connected Successfully")
    })
    .catch((e)=>{
        console.log("error connecting to database")
        console.log(e)
    })