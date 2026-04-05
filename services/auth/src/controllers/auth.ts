import axios from "axios";
import { tryCatch } from "../utils/TryCatch.js"
import ErrorHandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import bcrypt from "bcryptjs";
import getBuffer from "../utils/buffer.js"
import jwt from "jsonwebtoken";
import express from "express";
import multer from "multer";
import { publishToTopic } from "../producer.js";
import { forgotPasswordTemplate } from "../template.js";
import { redisClient } from "../index.js";

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

    //     const file = req.file as Express.Multer.File
    //     if(!file){
    //         throw new ErrorHandler(400, "Resume file is required")
    //     }
    //     const filebuffer = getBuffer(file)
    //     if(!filebuffer){
    //         throw new ErrorHandler(500, "Failed to generate buffer")
    //     }
    // const {data} = await axios.post(`${process.env.UPLOAD_SERVICES}/api/utils/upload`,{buffer:filebuffer.content})



        // const [user] = await sql `INSERT INTO users (name , email , password , phone_number, role, bio, resume, resume_public_id )
        // Values (${name} , ${email}, ${hashPassword}, ${phoneNumber} , ${role} ${data.url}, ${data.public_id}) RETURINING
        // user_id, name, email, phone_number, role, bio, resume, created_at`;
        // registerUser = user;    

        //testing
        const [user] = await sql `INSERT INTO users (name , email , password , phone_number, role, bio, resume, resume_public_id )
        Values (${name} , ${email}, ${hashPassword}, ${phoneNumber} , ${role},${bio} ,'test','67') RETURNING
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
});

export const loginUser = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorHandler(400, "Please fill all details");
  }

  const user = await sql`
  SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, u.subscription, ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id
  LEFT JOIN skills s ON us.skill_id = s.skill_id
  WHERE u.email = ${email} GROUP BY u.user_id;
  `;

  if (user.length === 0) {
    throw new ErrorHandler(400, "Invalid credentials");
  }

  const userObject = user[0];

  const matchPassword = await bcrypt.compare(password, userObject.password);

  if (!matchPassword) {
    throw new ErrorHandler(400, "Invalid credentials");
  }

  userObject.skills = userObject.skills || [];

  delete userObject.password;

  const token = jwt.sign(
    { id: userObject?.user_id },
    process.env.JWT_SEC as string,
    {
      expiresIn: "15d",
    }
  );

  res.json({
    message: "user Loggedin",
    userObject,
    token,
  });
});


export const forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new ErrorHandler(400, "email is required");
  }

  const users =
    await sql`SELECT user_id, email FROM users WHERE email = ${email}`;

  if (users.length === 0) {
    return res.json({
      message: "If that email exists, we have sent a reset link",
    });
  }
  const user = users[0];

  const resetToken = jwt.sign(
    {
      email: user.email,
      type: "reset",
    },
    process.env.JWT_SEC as string,
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

    await redisClient.set(`forgot:${email}`, resetToken, {
      EX: 900,
    });

  const message = {
    to: email,
    subject: "RESET Your Password - hireheaven",
    html: forgotPasswordTemplate(resetLink),
  };

  publishToTopic("send-mail", message).catch((error) => {
    console.error("failed to send message", error);
  });

  res.json({
    message: "If that email exists, we have sent a reset link",
  });
});

export const resetPassword = tryCatch(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  let decoded: any;

  try {
    decoded = jwt.verify(token as string, process.env.JWT_SEC as string);
  } catch (error) {
    throw new ErrorHandler(400, "Expired token");
  }

  if (decoded.type !== "reset") {
    throw new ErrorHandler(400, "Invalid token type");
  }

  const email = decoded.email;

  const stroredToken = await redisClient.get(`forgot:${email}`);

  if (!stroredToken || stroredToken !== token) {
    throw new ErrorHandler(400, "token has been expired");
  }

  const users = await sql`SELECT user_id FROM users WHERE email = ${email}`;

  if (users.length === 0) {
    throw new ErrorHandler(404, "User not found");
  }

  const user = users[0];

  const hashPassword = await bcrypt.hash(password, 10);

  await sql`UPDATE users SET password = ${hashPassword} WHERE user_id = ${user.user_id}`;

  await redisClient.del(`forgot:${email}`);

  res.json({ message: "Password changed successfully" });
});
