const db = require('../db');

module.exports = class Note {

    // class constructor
    constructor(user, text) {
        this.id = undefined
        this.user_id = user.id
        this.text = text
    }

    static async fetchByUser(user) {

        let results = await dbGetNotesByUserId(user.id);
        let notes = [];

        for (let result of results) {
            let newnote = new Note(user, result.text)
            newnote.id = result.id
            notes.push(note)
        }
        return notes
    }

    // check if note is persisted to database
    isPersisted() {
        return this.id !== undefined
    }

    // save note to the database
    async persist() {
        try {
            let noteId = await dbNewNote(this);
            this.id = noteId;
        } catch (err) {
            console.log("ERROR persisting note data: " + JSON.stringify(this));
            throw err;
        }
    }
}

// fetch notes from database by user id
dbGetNotesByUserId = async (user_id) => {
    const sql = `SELECT id, user_id, text FROM notes WHERE user_id = ` + user_id;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// insert new note into database
dbNewNote = async(note) => {
    const sql = "INSERT INTO notes (user_id, text) VALUES ('" +
        notes.user_id + "', '" + notes.text + "') RETURNING id";
    
    try {
        const result = await db.query(sql, []);
        return results.row[0].id;
    } catch (err) {
        console.log(err);
        throw err;
    }
}