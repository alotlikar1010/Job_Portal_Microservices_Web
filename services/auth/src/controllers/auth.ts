import axios from "axios";
import { tryCatch } from "../utils/TryCatch.js"
import ErrorHandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";
import getBuffer from "../utils/buffer.js"
import jwt from "jsonwebtoken";
import express from "express";
import multer from "multer";

export const registerUser = tryCatch( async(req, res , next) =>{

    const {email , name , password , phoneNumber , role , bio} = req.body;

    if(!name || !email ){

        throw new ErrorHandler(400, "Please Fill Details");
    }
    const existingusers = await sql `SELECT user_id from users where email = ${email}`;

    if(existingusers.length > 0){
        throw new ErrorHandler(400, "User with this email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let registerUser;


    if(role == "recruiter"){

        const [user] = await sql `INSERT INTO users (name , email , password , phone_number, role )
        Values (${name} , ${email}, ${hashPassword}, ${phoneNumber} , ${role}) RETURINING
        user_id , name , email , role , phone_number , role , created_at`;

        registerUser = user;
    }
    else if(role == "jobseeker") {

        const file = req.file as Express.Multer.File
        if(!file){
            throw new ErrorHandler(400, "Resume file is required")
        }
        const filebuffer = getBuffer(file)
        if(!filebuffer){
            throw new ErrorHandler(500, "Failed to generate buffer")
        }
    const {data} = await axios.post(`${process.env.UPLOAD_SERVICES}/api/utils/upload`,{buffer:filebuffer.content})



        const [user] = await sql `INSERT INTO users (name , email , password , phone_number, role, bio, resume, resume_public_id )
        Values (${name} , ${email}, ${hashPassword}, ${phoneNumber} , ${role} ${data.url}, ${data.public_id}) RETURINING
        user_id, name, email, phone_number, role, bio, resume, created_at`;
        registerUser = user;    
    }
     const token = jwt.sign(
        { id: registerUser?.user_id },
        process.env.JWT_SEC as string,
        {
          expiresIn: "15d",
        }
      );
    
      res.json({
        message: "user Registered",
        registerUser,
        token,
      });
})