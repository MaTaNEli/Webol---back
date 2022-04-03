import { createConnection } from "typeorm";

export async function initStorage() {
    await createConnection({
        type: 'postgres',
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT),
        username: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DB,
        entities: [ __dirname + '/entity/*{.ts,.js}' ],
        synchronize: true,
        //logging: true
    })
};
