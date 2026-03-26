import app from './app.js';
import dotenv from 'dotenv'
import { sql } from './utils/db.js';
import {createClient} from 'redis';


dotenv.config();


export const redisClient = createClient({

    url:process.env.UPSTASH_REDIS_REST_URL
});

redisClient.connect().then( () => 
console.log("connected to redis") )
.catch(console.error)


async function initDb(){

    try{

        await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname ='user_role') THEN
            CREATE TYPE user_role as ENUM ('jobseeker','recruiter');
        
            END IF;
            END$$;       
        `;

        await sql`
        CREATE TABLE IF NOT EXISTS users 
        (
        user_id SERIAL PRIMARY KEY ,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        role user_role NOT NULL ,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255), 
        profile_pic VARCHAR(255),
        profile_pic_public_id VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ
        )
        `;


        await sql `
           CREATE TABLE IF NOT EXISTS skills 
        (
        skill_id SERIAL PRIMARY KEY ,
        name VARCHAR(255) NOT NULL UNIQUE   
        ) 
        `;

            await sql `
           CREATE TABLE IF NOT EXISTS user_skills 
        (
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE
        CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE
        CASCADE, 
        PRIMARY KEY (user_id , skill_id)
        ) 
        `;


    } catch(error) {
        console.log(error)
    }

}




app.listen(process.env.PORT, () =>{

    console.log("server running");

    initDb();
})