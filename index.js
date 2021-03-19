const express = require('express')
const app = express()
const port = 5000
const bodyPaser = require('body-parser')
const User = require('./models/User')


// application/x-www-form-urlencoded 형식의 데이터를 가져오기위한 설정
app.use(bodyPaser.urlencoded({extended: true}))
// application/json
app.use(bodyPaser.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yoonho:990922@cluster0.fk6wc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/register', (req, res) => {
    
    // 회원 가입 할때 필요한 정보들을 client에서 가져와 데이터베이스에 넣음

    const user = new User(req.body)

    user.save((err, userInfo) =>{
        if(err) return res.json({ success: false, err })

        return res.status(200).json({ success: true })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})