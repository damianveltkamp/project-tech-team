import userModel from '../../models/user.model'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export default {
  getAll: async () => {
    return userModel.find({}).lean()
      .then(users => users)
  },
  getUser: async (email) => {
    return userModel.findOne({email: email}).lean()
      .then(user => {
        return user
      })
  },
  getUserByID: async (id) => {
    return userModel.findOne({_id: id}).lean()
      .then(user => {
        return user
      })
  },
  createNewUser: async (email, password, emailToken) => {
    const error = {}
    const userAlreadyExists = await userModel.findOne({email: email}).lean()
      .then(user => user)

    if (userAlreadyExists) {
      error.message = `There is already an account created for ${userAlreadyExists.email}`
    }

    const newUser = new userModel({
      email: email,
      password: password,
      emailToken: emailToken
    })

    newUser.save(error => {
      error ? console.log(`Something went wrong: ${error}`) : verificationEmail(email, emailToken)
    })

    return error
  },
  resendVerificationEmail: (email, emailToken) => {
    userModel.findOneAndUpdate({email: email}, {emailToken: emailToken})
      .then(() => {
        verificationEmail(email, emailToken)
      })
  },
  verify: async (emailToken) => {
    return userModel.findOneAndUpdate({emailToken: emailToken}, {$set: {isVerified: true, emailToken: ''}}).lean()
      .then(user => user)
  }
}

async function verificationEmail(email, emailToken) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465 ,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  })
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify account',
    html: `<a href="http://localhost:3001/verify-account?token=${emailToken}">Click this link to verify your email</a>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    error ? console.log(error.message) : console.log(`Message sent: ${info.response}`)
  })
}
