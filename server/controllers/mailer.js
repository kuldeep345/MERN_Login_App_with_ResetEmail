import nodemailer from 'nodemailer'
import Maingen from 'mailgen'
import ENV from '../config.js'


let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: ENV.EMAIL, // generated ethereal user
      pass: ENV.PASSWORD, // generated ethereal password
    },
  };

  let transporter = nodemailer.createTransport(nodeConfig);

  let MailGenerator = new Maingen({
    theme:"default",
    product:{
        name:"Mailgen",
        link:"https://mailgen.js"
    }
})

export const registerMail = async (req,res) => {
    const { username , userEmail , text , subject } = req.body;

    var email = {
        body:{
            name:username,
            intro: text || 'Welcome to Daily Tution! We\'re very exicted to have you on board',
            outro:'Need help, or have questions? Jsut reply to this email, we\'d love to help'
        }
    }

    var emailBody = MailGenerator.generate(email)

    let message = {
        from:process.env.EMAIL,
        to:userEmail,
        subject:subject || "Signup Successful",
        html:emailBody
    }

    transporter.sendMail(message).then(()=>{
        return res.status(200).send({ msg:"You should receive an email from us"})
    }).catch(error =>{
        console.log(error)
         res.status(500).send({error})
        })

}