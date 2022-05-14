import { createConnection } from "typeorm";

export async function initStorage() {
    await createConnection({
        type: 'postgres',
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT),
        username: process.env.PG_USER,
        password: process.env.DATA_BASE_PASS,
        database: process.env.PG_USER,
        entities: [ __dirname + '/entity/*{.ts,.js}' ],
        synchronize: true,
        //logging: true
    })
};

export async function initLocalStorage() {
    await createConnection({
        type: 'postgres',
        host: process.env.PG_HOST_LOCAL,
        port: parseInt(process.env.PG_PORT_LOCAL),
        username: process.env.PG_USER_LOCAL,
        password: process.env.PG_PASS_LOCAL,
        database: process.env.PG_DB_LOCAL,
        entities: [ __dirname + '/entity/*{.ts,.js}' ],
        synchronize: true,
        //logging: true
    })
};
