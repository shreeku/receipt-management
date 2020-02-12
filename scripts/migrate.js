const path =require('path');
const Umzug = require('umzug');

let umzug = new Umzug({
  logging: function(){
    console.log.apply(null, arguments);
  },
  migrations: {
    path: './db/migration',
    pattern: /\.js$/
  },
  upName: 'buildDB',
  downName: 'resetDB'
});

function logUmzugEvent(event){
  return function(name, migration){
    console.log(`${name} ${event}`);
  };
}

umzug.on('migration', logUmzugEvent('migrating'));
umzug.on('migrated', logUmzugEvent('migration completed'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted', logUmzugEvent('revert completed'));

umzug.up().then(console.log('Migration is Complete'));
//umzug.down().then(console.log('Database Wiped Clean'));
