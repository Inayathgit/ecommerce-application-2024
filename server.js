import express from 'express'
import morgan from 'morgan'
import Dotenv from 'dotenv'
import connecttoDB from './config/db.js'
import authroutes from './routes/authroutes.js'
import categoryroute from './routes/categoryroute.js'
import productroutes from './routes/productroutes.js'
import orderroutes from './routes/orderroutes.js'
import path  from 'path'
import { fileURLToPath } from 'url'
//rest object
const app = express()
//dotenv config
Dotenv.config()

//esmodule fix

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./client/build')))

//connect to DB

connecttoDB()





app.use('/api/v1/auth', authroutes)
app.use('/api/v1/auth', authroutes)
app.use('/api/v1/category',categoryroute)
app.use('/api/v1/product',productroutes)
app.use('/api/v1/order',orderroutes)
//port
const PORT = process.env.PORT || 8080

// rest api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})



//app running
app.listen(PORT, () => {
    console.log(`Server running on  ${process.env.DEV_MODE} mode port ${PORT}`)
})
