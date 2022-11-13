const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'lab2-baza',
    password: 'password',
    port: 5433,
});

const sql_create_users = `CREATE TABLE users (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name text NOT NULL UNIQUE,
    password text NOT NULL
)`;

const sql_create_users_id_index = `CREATE UNIQUE INDEX idx_usersId on users(id)`;

const sql_create_notes = `CREATE TABLE notes (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id int REFERENCES users(id),
    note text NOT NULL
);`;

const sql_create_notes_id_index = `CREATE UNIQUE INDEX idx_notesId on notes(id)`;

const sql_create_sessions = `CREATE TABLE session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);`;

const sql_create_session_index1 = `ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE`;
const sql_create_session_index2 = `CREATE INDEX IDX_session_expire ON session(expire)`;

const sql_insert_users = `INSERT INTO users (
    user_name, password
    ) VALUES 
    ('johnDoe', 'testpassword1'),
    ('willSteal', 'testpassword2'),
    ('joeSmith', 'testpassword3')`;

const sql_insert_notes = `INSERT INTO notes (
    user_id, note) VALUES 
    (1, 'Super secret note'),
    (1, 'buy list of this'),
    (2, 'Some other stuff'),
    (3, 'joes secret note'),
    (3, 'joes second secret note')`;

let table_names = [
    "users",
    "notes",
    "sessions"
];

let tables = [
    sql_create_users,
    sql_create_notes,
    sql_create_sessions
];

let table_data = [
    sql_insert_users,
    sql_insert_notes,
    undefined
];

let indexes = [
    sql_create_users_id_index,
    sql_create_notes_id_index,
    sql_create_session_index1,
    sql_create_session_index2
];

if ((tables.length !== table_data.length) || (tables.length !== table_names.length)) {
    console.log("tables, names and data arrays length mismatch")
    return
}

// Create tables and populate with data
(async () => {
    console.log("Creating and populating tables");
    for (let i = 0; i < tables.length; i++) {
        console.log("Creating table " + table_names[i] + ".");
        try {
            await pool.query(tables[i], [])
            console.log("Table " + table_names[i] + " created.");
            if (table_data[i] !== undefined) {
                try {
                    await pool.query(table_data[i], [])
                    console.log("Table " + table_names[i] + " populated with data.");
                } catch (err) {
                    console.log("Error populating table " + table_names[i] + " with data.")
                    return console.log(err.message);
                }
            }
        } catch (err) {
            console.log("Error creating table " + table_names[i])
            return console.log(err.message);
        }
    }

    console.log("Creating indexes");
    for (let i = 0; i < indexes.length; i++) {
        try {
            await pool.query(indexes[i], [])
            console.log("Index " + i + " created.")
        } catch (err) {
            console.log("Error creating index " + i + ".")
        }
    }

    await pool.end();
})()
