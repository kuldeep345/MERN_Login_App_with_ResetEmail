import User from "../model/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

export async function verifyUser(req,res,next){
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let existuser = await User.findOne({username})
        if(!existuser) return res.status(404).send({error : "Can't find User!"})
        next();

    } catch (error) {
        return res.status(404).send({error:"Authentication Error"})
    }
}

export async function register(req,res){
    try {
        const { username , password , profile , email } = req.body

        const existUsername = new Promise((resolve , reject)=>{
            User.findOne({ username } , function(err,user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"})

                resolve()
            })
        })

        const existEmail = new Promise((resolve , reject)=>{
            User.findOne({ email } , function(err,email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique email"})

                resolve()
            })
        });

        Promise.all([existUsername , existEmail]).then(()=>{
            if(password){
                bcrypt.hash(password , 10).then(hashedPassword => {
                    const user = new User({
                        username,
                        password:hashedPassword,
                        profile:profile || '',
                        email
                    })

                    user.save()
                    .then(result => res.status(201).send({msg:"User Register Successfully" , result}))
                    .catch(error => res.status(500).send({error}))

                }).catch(error => {
                    return res.status(500).send({
                        error:"Enable to hash password"
                    })
                })
            }
        }).catch(error=>{
            console.log(error)
            return res.status(500).send({
                error:"Enable to hashed password"
            })
        })

    } catch (error) {
        
    }
}

export async function login(req,res){
    const { username , password } = req.body

    try {
        User.findOne({username}).then(user=>{
            bcrypt.compare(password , user.password).then(passwordCheck => {
                if(!passwordCheck) return res.status(400).send({ error : "Password does not Match"})

                const token = jwt.sign({userId:user._id , username:user.username} , process.env.SECRET , { expiresIn:"24h" })
                return res.status(200).send({
                    msg:"Login Successful...!",
                    username:user.username,
                    token
                })

            }).catch(err=>{
                return res.status(400).send({error:"Password does not Match"})
            })
        }).catch(error => {
            return res.status(404).send({ error : "Username not Found"})
        })
    } catch (error) {
        return res.status(500).send({ error })
    }
}

export async function getUser(req,res){
    const { username} = req.params

    try {
        if(!username) return res.status(501).send({error:"Invalid Username"})

        User.findOne({username} , function(err , user){
            if(err) return res.status(500).send({err})
            if(!user) return res.status(501).send({error:"Couldn't Find the User"})

            const { password , ...rest } = Object.assign({} , user.toJSON());

            return res.status(201).send(rest)
        })

    } catch (error) {
        console.log(error)
        return res.status(404).send({error})
    }
}

export async function updateUser(req,res){
    try {
        const {userId} = req.user

        if(userId){
            const body = req.body

            User.updateOne({ _id : userId} , body , function(err,data){
                if(err) throw err;
                console.log(err)
                return res.status(201).send({msg:"Record Updated...!"})
            })
        }
        else{
            return res.status(401).send({error:"User Not Found...!"})
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}

export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false , upperCaseAlphabets:false , specialChars:false})
    res.status(201).send({ code: req.app.locals.OTP })
}

export async function verifyOTP(req,res){
    const { code } = req.query
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg:'Verify Successfully' })
    }
    return res.status(400).send({error:"Invalid OTP"})
}

export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false;
        return res.status(201).send({msg:"access granted!"})
    }

    return res.status(440).send({error:"Session expired!"})

}

export async function resetPassword(req,res){
   try {

    if(!req.app.locals.resetSession) return res.status(440).send({error:"Session expired!"})

    const { username, password } = req.body

    try {
        User.findOne({ username }).then(user=>{
            bcrypt.hash(password , 10)
                .then(hashedPassword => {
                    User.updateOne({ username : user.username } , { password: hashedPassword }, function(err,data){
                        if(err) throw err;
                        return res.status(201).send({ msg:"Record Updated...!" })
                    })
                }).catch(e =>{
                    return res.status(500).send({
                        error:"Enable to hashed password"
                    })
                })
        }).catch(error=>{
            return res.status(404).send({ error : "Username not Found" })
        })
    } catch (error) {
        return res.status(500).send({error})
    }

   } catch (error) {
    return res.status(401).send({error})
   }
}






