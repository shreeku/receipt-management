const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const multipart = require('connect-multiparty');
const bcrypt = require('bcrypt');
const PORT = 5000;
const saltRounds = 10;

const app =express();
const multipartMiddleware = multipart();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function isEmpty(element){
  if(element == null){
    return true
  }else {
    return false
  }
};
//base page response
app.get('/', function(req,res){
  res.send("Receipt Managment !!!")
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});

//listening to expected PORT
app.listen(PORT, function(){
  console.log(`Application listening on PORT:${PORT}`);
});

app.post('/register', multipartMiddleware, function(req, res){
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  if(isEmpty(req.body.name) ||
     isEmpty(req.body.email) ||
     isEmpty(req.body.password)){
       return res.json({
         'status': false,
         'message': "Fields must be filled"
       });
     }

  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    let db = new sqlite.Database('./db/ReceiptMgt.db');
    let query = `INSERT INTO users(name,email,password) VALUES('${
      req.body.name}','${req.body.email}','${hash}')`;
    db.run(query, function(err){
      if(err){
        throw err;
      }else {
        return res.json({
          status: true,
          message: 'User Created Successfully'
        });
      }
    });
    db.close();
  });
});

app.post('/login', multipartMiddleware, function(req, res){
  let db = new sqlite.Database('./db/ReceiptMgt.db');
  let query = `SELECT * from users WHERE email='${req.body.email}'`;
  db.all(query, [], (err, rows) => {
    if(err){
      throw err;
    }
    db.close();
    if(rows.length == 0){
      return res.json({
        status: false,
        message: "User doesn't exist in our Databse"
      });
    }
    let user = rows[0];
    let authSuccess = bcrypt.compareSync(req.body.password, user.password);
    delete user.password;
    if(authSuccess){
      return res.json({
        status: true,
        user: user
      });
    }
    return res.json({
      status: false,
      message: "Wrong Password, retry again !"
    });
  });
});

app.post('/receipt', multipartMiddleware, function(req, res){
  if(isEmpty(req.body.name)){
    return res.json({
      status: false,
      message: 'Receipt needs a name'
    });
  }

  let db = new sqlite.Database('./db/ReceiptMgt.db');
  let query = `INSERT INTO receipts(name,user_id,amount) VALUES(
    '${req.body.name}',
    '${req.body.user_id}',
    100
  )`;

  db.serialize(function(){
    db.run(query, function(err){
      if(err){
        throw err;
      }

      let receipt_id = this.lastID;
      for(let i=0;i<req.body.txn_names.length;i++){
        let query = `INSERT INTO transactions(name,price,receipt_id) VALUES(
          '${req.body.txn_names[i]}',
          '${req.body.txn_prices[i]}',
          '${receipt_id}'
        )`;
        db.run(query);
      }
      return res.json({
        status: true,
        message: 'Receipt Created'
      });
    });
  });
});

app.get('/receipt/user/:user_id', multipartMiddleware, function(req, res){
  let db = new sqlite.Database('./db/ReceiptMgt.db');
  let query = `SELECT * FROM receipts LEFT JOIN transactions ON
  receipts.id=transactions.receipt_id WHERE user_id='${req.params.user_id}'`;
  db.all(query, [], (err, rows) => {
    if(err){
      throw err;
    }

    return res.json({
      status: true,
      transactions: rows
    });
  });
});

app.get('/receipt/user/:user_id/:receipt_id', multipartMiddleware, function(req, res){
  let db = new sqlite.Database('./db/ReceiptMgt.db');
  let query = `SELECT * FROM receipts LEFT JOIN transactions ON
  receipts.id=transactions.receipt_id WHERE user_id='${req.params.user_id}'
  AND receipt_id='${req.params.receipt_id}'`;
  db.all(query, [], (err, rows) => {
    if(err){
      throw err;
    }

    return res.json({
      status: true,
      transactions: rows
    });
  });
});
