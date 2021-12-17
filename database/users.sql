CREATE TABLE users (
    contact_id uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR ( 50 ) UNIQUE NOT NULL,
    email VARCHAR ( 100 ) UNIQUE NOT NULL,
    password VARCHAR ( 1000 ) NOT NULL,
    full_name VARCHAR ( 100 ) UNIQUE NOT NULL,
    login VALUES ( 50 ) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    PRIMARY KEY (contact_id)   
);