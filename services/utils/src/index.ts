import express from 'express'
import dotenv from 'dotenv'
import routes from './routes.js'
import cors from 'cors'
import {v2 as cloudinary} from "cloudinary"
import { startSendMailConsumer } from './consumer.js'
const app = express();
app.use(cors());

dotenv.config();
startSendMailConsumer();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({limit:"50mb", extended: true}));

app.use("/api/utils", routes);

app.listen(process.env.PORT, () =>{
    `Utils Service is running on http://localhost:${process.env.PORT}`
})
