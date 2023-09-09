const DummyUser = require('../model/DummyUser')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const User = require('../model/User')

const verifyNewUser = async (req, res) => {
    const { mail, otp } = req.body
    if (!otp) return res.status(400).json({ 'message': 'enter otp' })
    if (!mail) return res.status(400).json({ 'message': 'Email not found.SignUp again ' })

    const NonVerified = await DummyUser.findOne({ email: mail }).exec()
    if (!NonVerified) return res.status(400).json({ 'message': 'signup again' })
    try {
        if (otp === NonVerified.otp) {
            const result = await User.create
                ({

                    "email": mail,
                    "username": NonVerified.username,
                    "password": NonVerified.password
                });
            console.log(result);

            let config =
            {
                service: 'gmail',
                auth:
                {
                    user: process.env.GMAIL,
                    pass: process.env.PASS
                }
            }

            let transporter = nodemailer.createTransport(config);

            let MailGenerator = new Mailgen
                ({
                    theme: "cerberus",
                    product:
                    {
                        name: "MITS HALLS.",
                        link: 'https://mailgen.js/' //site of our link
                    }
                })
            let response =
            {
                body:
                {
                    name: req.body.user,
                    greeting: 'Welcome',
                    intro: 'You are successfully registered with MITS HALLS!',
                    table:
                    {
                        data:
                            [
                            ],
                        columns:
                        {
                            // Optionally, customize the column widths
                            customWidth:
                            {
                                username: '30%',
                                email: '40%'
                            }
                        }
                    },
                    outro: "For Login use Email and Password from Email Verification mail",
                    signature: 'Thank you for choosing us:)'
                }
            }

            let email = MailGenerator.generate(response)

            let message =
            {
                from: process.env.GMAIL,
                to: req.body.mail,
                subject: "SignIn confirmation!",
                html: email
            }

            transporter.sendMail(message).then
                (() => {
                    return res.status(201).json
                        ({
                            msg: "you should receive an email", result
                        })
                }).catch(error => {
                    return res.status(500).json({ error })
                })
        }
        await DummyUser.deleteOne({ _id: NonVerified._id });
    console.log('Record deleted successfully');
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}
module.exports = { verifyNewUser }