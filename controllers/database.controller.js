import { MongoClient } from 'mongodb';
const ObjectId = require("mongodb").ObjectID;

export async function accountPost(req, res) {
  const data = {
    userID: ObjectId().toString(),
    gender: req.body.gender,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };
  const db = await connectDB();
  db.collection('accounts').insertOne(data, () => {
    console.log(data.firstName, 'Heeft succesvol form ingezonden');
  });
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return await client.db(process.env.DB_NAME);
}