const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')

const authRouter = require('./routes/auth.routes')
const linkRouter = require('./routes/link.routes')
const redirectRoutes = require('./routes/redirect.routes')
const app = express()

app.use(express.json({extended:true}))


app.use('/api/auth',authRouter)
app.use('/api/link',linkRouter)
app.use('/t',redirectRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use('/',express.static(path.join(__dirname,'client','build')))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true
        })
        app.listen(PORT,()=> console.log(`app has been started on port ${PORT}...`))
    }catch(e){
        console.log('Server error',e.message)
        process.exit(1)
    }
}

start()