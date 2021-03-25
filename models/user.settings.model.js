import mongoose from 'mongoose';

const schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const clusterSchema = new schema({
  userID: {
    type: String,
    required: [true, 'User ID is required'],
    unique: [true, 'There can only be one settings profile for this user'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  likedCompanies: {
    type: Array,
    default: [],
  },
  dislikedCompanies: {
    type: Array,
    default: [],
  },
});

export default mongoose.model('userSettings', clusterSchema);
