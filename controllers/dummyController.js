const User = require('../model/User')
const DummyUser = require('../model/DummyUser')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const otpGenerator = require('otp-generator');

const handleNewUser = async(req, res)=>{
    const{mail,user,pwd}=req.body
    if(!mail||!user||!pwd) return res.status(400).json({'message':'all fields are required.'})//bad request=400

    const duplicate=await User.findOne({email:mail}).exec();
    const duplicate1=await DummyUser.findOne({email:mail}).exec();
    if(duplicate)return res.status(400).json({ 'message': ' Email is taken.' })
    if(duplicate1)return res.status(400).json({ 'message': 'try again after 5 min.' })
     
    try{

        const hashedPwd=await bcrypt.hash(pwd,10)
        //const otp=await otpGenerator.generate(6)//,{ digits:true, alphabets: false, upperCase: false, specialChars: false})
        //const OTP = otp.replace(/\D/g, ''); 
        const otp=Math.floor(Math.random()*1000000)+6
        const OTP=otp.toString()
        console.log(OTP)
        const result=await DummyUser.create(
            {
                "email":mail,
                "username":user,
                "password":hashedPwd,
                "otp":OTP
            }
        )
        let config={
            service:'gmail',
            auth:{
                user:process.env.GMAIL,
                pass:process.env.PASS
            }
        }
        let transporter=nodemailer.createTransport(config)

        let MailGenerator=new Mailgen({
            theme:"cerberus",
            product:{
                name:"MITS HALLS.",
                link:'https://mitshalls.onrender.com/'
            }
        })
        let response = {
            body: {
                name: req.body.user,
                greeting:'Hi..',
                intro: 'You Email is to be verifed!',
                table: {
                    data: [
                        {
                            username:req.body.user,
                            password:req.body.pwd,
                            otp:result.otp
                        }
                    ],
                    columns: {
                        // Optionally, customize the column widths
                        customWidth: {
                            username: '30%',
                            password: '30%'
                        }
                    }
                },
                outro: "Use Email and Password for Login",
                signature: 'Thank you for choosing us:)'
            }
        }

        let email = MailGenerator.generate(response)

        let message = {
            from: process.env.GMAIL,
            to: req.body.mail,
            subject: "Email Verification!",
            html: email
        }

        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "you should receive an email", result
            })
        }).catch(error => {
            return res.status(500).json({ error })
        })
 
        console.log(result);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };