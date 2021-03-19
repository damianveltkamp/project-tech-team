import mongoose from 'mongoose'


const schema = mongoose.Schema
mongoose.set('useCreateIndex', true)


const cluster_schema = new schema({
  userID: {
    type: String,
    required: [true, 'User ID is required'],
    unique: [true, 'There can only be one settings profile for this user']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  }
})


export default mongoose.model('userSettings', cluster_schema)
