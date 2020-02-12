'use strict';
const Promise = require('bluebird');
const sqlite = require('sqlite3');
const path = require('path');

module.exports = {
  buildDB: function() {
    return new Promise(function(resolve, reject) {
      let db = new sqlite.Database('./db/ReceiptMgt.db');
      db.run(`PRAGMA foreign_keys = ON`);

      db.serialize(function() {
        db.run(`CREATE TABLE users(
          id INTEGER PRIMARY KEY,
          name TEXT,
          email TEXT,
          password TEXT
        )`);

        db.run(`CREATE TABLE receipts (
          id INTEGER PRIMARY KEY,
          name TEXT,
          user_id INTEGER,
          amount NUMERIC,
          FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE transactions (
          id INTEGER PRIMARY KEY,
          name TEXT,
          price INTEGER,
          receipt_id INTEGER,
          FOREIGN KEY(receipt_id) REFERENCES receipts(id)
        )`);
      });
      db.close();
    });
  },

  resetDB: function() {
    return new Promise(function(resolve, reject){
      let db = new sqlite.Database('./db/ReceiptMgt.db');
      db.serialize(function(){
        db.run(`DROP TABLE transactions`);
        db.run(`DROP TABLE receipts`);
        db.run(`DROP TABLE users`);
      });
      db.close();
    });
  }
};
