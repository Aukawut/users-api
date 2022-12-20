const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())
const connection = mysql.createConnection(process.env.DATABASE_URL);
const secret = process.env.SECRET_KEY

app.get('/users', function (req, res) {
    connection.query(
        'SELECT * FROM tb_users',
        function(err, results) {
            if(err) { throw err }
            res.json({results: results})
        }
      );
})
app.post('/register',(req,res) => {
    const username = req.body.username
    const name = req.body.name
    const password = req.body.password 
    const phone = req.body.phone 
    const email = req.body.email 
    bcrypt.hash(password, saltRounds, function(err, hash) {
        connection.query(
            'INSERT INTO tb_admin (username,password,name,email,phone) VALUES (?,?,?,?,?)',[username,hash,name,email,phone],
            function(err,results){
                if(err) {throw err }
                res.json({err:false,results:results})
            }
        )
    });
})
app.post('/login',(req,res) => {
    const username = req.body.username 
    const password = req.body.password 
    connection.query(
        'SELECT * FROM tb_admin WHERE username = ?',[username],
        function(err,results){
            if(err) { throw err }
            if(!results.length > 0){
            res.json({err:true,msg:'username not found'})

            }else{
                const password_hash = results[0].password
                bcrypt.compare(password, password_hash).then(function(result) {
                  if(result){
                    var token = jwt.sign({ username: results[0].username,name:results[0].name },secret,{ expiresIn: '2h' });
                    res.json({err:false,results:results,token:token})
                  }else{
                    res.json({err:true,msg:'password invalid'})
                  }
                });
          
        }
        }
    )
})
app.post('/authen',(req,res) => {
    const token  = req.headers.authorization.split(' ')[1]
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            res.json({err:true,msg:'Token invalid!'})
        }else{
            res.json({err:false,result:decoded})
        }
      });
})
app.post('/add',(req,res) => {
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const position = req.body.position
    connection.query(
        'INSERT INTO tb_users (fname,lname,email,position_) VALUES (?,?,?,?)',[fname,lname,email,position],
        function(err,results){
            if(err) { throw err }
            res.json({err:false,msg:'inserted successfully',results:results})
        }
    )
})
app.post('/delete',(req,res) => {
    const id = req.body.id
    connection.query(
        'DELETE FROM tb_users WHERE id = ?',[id],function(err,results){
            if(err) { throw err }
            res.json({err:false,msg:'deleted successfully',results:results})
        }
    )
})
app.post('/update',(req,res) => {
    const id = req.body.id
    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const position = req.body.position
    connection.query(
        'UPDATE tb_users SET fname = ? , lname = ? , email = ? , position_ = ? WHERE id = ?',[fname,lname,email,position,id],
        function(err,results){
            if(err) { throw err }
            res.json({err:false,msg:'updated successfully',results:results})
        }
    )
})
app.post('/getperuser',(req,res) => {
    const id = req.body.id
    connection.query(
        'SELECT * FROM tb_users WHERE id = ?',[id],function(err,results){
            if(err){ throw err}
            res.json({err:false,results:results})
        }
    )
})
app.get('/travel',(req,res) => {
    connection.query(
        'SELECT * FROM attractions',function(err,results){
            if(err){ throw err}
            res.json({err:false,results:results})
        }
    )
})
app.listen(process.env.PORT || 5001, function () {
  console.log('Server is running..')
})