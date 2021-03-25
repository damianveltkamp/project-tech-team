import mongoose from 'mongoose';

const schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const clusterSchema = new schema({
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: [true, 'There is already a account created with this emailadress'],
  },
  password: {
    type: String,
    required: [true, 'Password field is required'],
  },
  emailToken: {
    type: String,
    required: [true, 'Emailtoken generation is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  hasSetupAccount: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
});

export default mongoose.model('users', clusterSchema);
