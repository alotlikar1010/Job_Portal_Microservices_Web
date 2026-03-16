import { Request, Response } from "express"
import { tryCatch } from "../utils/TryCatch.js"
import ErrorHandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";


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

        
        const [user] = await sql `INSERT INTO users (name , email , password , phone_number, role )
        Values (${name} , ${email}, ${hashPassword}, ${phoneNumber} , ${role}) RETURINING
        user_id , name , email , role , phone_number , role , created_at`;

    }
    res.json(email)
})