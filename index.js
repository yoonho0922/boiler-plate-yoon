const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const User = require('./models/User')
const config = require('./config/key')


// application/x-www-form-urlencoded 형식의 데이터를 가져오기위한 설정
app.use(bodyParser.urlencoded({extended: true}))
// application/json
app.use(bodyParser.json())
app.use(cookieParser())

// 데이터베이스 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected.'))
  .catch(err => console.log(err))

// 라우팅
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    
    // 회원 가입 할때 필요한 정보들을 client에서 가져와 데이터베이스에 넣음

    const user = new User(req.body)

    user.save((err, userInfo) =>{
        if(err) return res.json({ success: false, err })

        return res.status(200).json({ success: true })
    })
})

app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 디비에서 찾음
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch){
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            }

            // 비밀번호 일치시 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 쿠키에 토큰을 저장한다 (이외에는 로컬스토리지, 세션 등에 저장할 수 있음)
                res.cookie("x_auth:", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })

            })
        })
    })
})

// 서버 실행
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})