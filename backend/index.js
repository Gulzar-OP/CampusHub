import dotenv from 'dotenv'
dotenv.config()
import cookieParser from "cookie-parser";
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoute.js'
import connectDB from './utils/db.js'

const app = express()
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173', process.env.FRONTEND_URL]
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT || 4000

app.get('/',(req, res)=>{
  res.send('Hello from backend')
})

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`)
})
