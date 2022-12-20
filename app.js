const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2');
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())

const connection = mysql.createConnection(process.env.DATABASE_URL);
app.get('/users', function (req, res) {
    connection.query(
        'SELECT * FROM tb_users',
        function(err, results) {
            if(err) { throw err }
            res.json({results: results})
        }
      );
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
app.listen(process.env.PORT || 5001, function () {
  console.log('Server is running..')
})