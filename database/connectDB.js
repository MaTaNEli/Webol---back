// const { Client } = require('pg');

// const client = new Client({
//     user: "postgres",
//     password: "allober77354hhzxm",
//     port: 5433,
//     database: "Webol",
// });

// const execute = async (query) => {
//     try {
//         await client.connect();     // gets connection
//         await client.query(query);  // sends queries
//         return true;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     } finally {
//         await client.end();         // closes connection
//     }
// };

// const text =`CREATE TABLE IF NOT EXISTS "users" (
//     "contact_id" SERIAL ,
//     "username" VARCHAR ( 50 ) UNIQUE NOT NULL,
//     "email" VARCHAR ( 100 ) UNIQUE NOT NULL,
//     "password" VARCHAR ( 1000 ) NOT NULL,
//     "full_name" VARCHAR ( 100 ) UNIQUE NOT NULL,
//     "login" NOT NULL,
//     "created_on" TIMESTAMP NOT NULL,
//     "last_login" TIMESTAMP,
//     "PRIMARY KEY" ("contact_id")   
// );`;

// execute(text).then(result => {
//     if (result) {
//         console.log('Table created');
//     }
// });

// const t = client.query("SELECT * FROM users")
// console.table(t);







// //client.connect()


// // client.connect()
// // .then(() => console.log("Connected to database"))
// // .catch(e => console.log(e))
// // .finally(() => client.end());
// // // Access to veriables set in the .env file via 'process.env.VERIABLE_NAME'
// // require ('dotenv').config();

