import userModel from '../../models/user.model';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function verificationEmail(email, emailToken) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify account',
    html: `<a href="http://localhost:3001/verify-account?token=${emailToken}">Click this link to verify your email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    error
      ? console.log(error.message)
      : console.log(`Message sent: ${info.response}`);
  });
}

export default {
  getAll: async () =>
    userModel
      .find({})
      .lean()
      .then((users) => users),
  getUser: async (email) =>
    userModel
      .findOne({ email })
      .lean()
      .then((user) => user),
  getUserByID: async (id) =>
    userModel
      .findOne({ _id: id })
      .lean()
      .then((user) => user),
  createNewUser: async (email, password, emailToken) => {
    const errorObject = {};
    const userAlreadyExists = await userModel
      .findOne({ email })
      .lean()
      .then((user) => user);

    if (userAlreadyExists) {
      errorObject.message = `There is already an account created for ${userAlreadyExists.email}`;
    }

    const newUser = new userModel({
      email,
      password,
      emailToken,
    });

    newUser.save((error) => {
      if (!error) {
        verificationEmail(email, emailToken);
      }
    });

    return errorObject;
  },
  resendVerificationEmail: (email, emailToken) => {
    userModel.findOneAndUpdate({ email }, { emailToken }).then(() => {
      verificationEmail(email, emailToken);
    });
  },
  verify: async (emailToken) =>
    userModel
      .findOneAndUpdate(
        { emailToken },
        { $set: { isVerified: true, emailToken: '' } },
      )
      .lean()
      .then((user) => user),
};
