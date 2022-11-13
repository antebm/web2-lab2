const db = require('../db');

module.exports = class User {

    // constructor
    constructor(user_name, password){
        this.id = undefined
        this.user_name = user_name
        this.password = password
    }

    // fetch by username
    static async fetchByUsername(username){

        let results = await dbGetUserByUsername(username)
        let newUser = new User()

        if ( results.length > 0 ) {
            newUser = new User(results[0].user_name, results[0].password);
            newUser.id = results[0].id;
        }
        return newUser;
    } 
    // fetch by user id
    static async fetchByUserId(id) {

        let results = await dbGetUserById(id)
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].user_name, results[0].first_name,
                results[0].last_name, results[0].email, results[0].password, results[0].role)
            newUser.id = results[0].id
        }
        return newUser
    }

    // Check if user is saved to database
    isPersisted(){
        return this.id !== undefined;
    }

    // Check password
    checkPassword(password){
        return this.password ? this.password === password : false;
    }

    //dohvat korisnika iz baze podataka na osnovu korisničkog imena (stupac user_name)
    dbGetUserByName = async (user_name) => {
    const sql = `SELECT id, user_name, first_name, last_name, email, password, role
    FROM users WHERE user_name = '` + user_name + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

    //dohvat korisnika iz baze podataka na osnovu id korisnika (stupac id)
    dbGetUserById = async (user_id) => {
        const sql = `SELECT id, user_name, first_name, last_name, email, password, role
        FROM users WHERE id = ` + user_id;
        try {
            const result = await db.query(sql, []);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
}

    // insert new user into a database (SQL injection exploitable)
    dbNewUser = async (user) => {
        const sql = "INSERT INTO users (user_name, last_name, email, password, role) VALUES ('" +
            user.user_name + "', '" + user.password + "') RETURNING id";
        try {
            const result = await db.query(sql, []);
            return result.rows[0].id;
        } catch (err) {
            console.log(err);
            throw err
        }
    }    
}