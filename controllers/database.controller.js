import { MongoClient } from 'mongodb';

export async function resultsGet(req, res){
    const data = {
        layout: 'layout.html',
        title: 'result page',
      }
    const db = await connectDB();
    const accounts = await db.collection('Accounts').find({}).toArray();

    data.accounts = accounts;
    
    res.render('pages/results.html', data)
}

export async function resultsPost(req, res){
    const db = await connectDB();
    const accounts = await db.collection('Accounts').find({}).toArray();
    const searched = (req.body.subject);
    const filteredSubject = accounts.filter(function (Accounts) {
        return Accounts.subject.includes(req.body.subject);
    });
    const data = {
        layout: 'layout.html',
        title: 'result page',
        resultsQuantity: filteredSubject.length,
        searchSubject: searched,
        account: filteredSubject
    }
       
    // toevoegen van gezochte onderwerp naar database 
    const searchHistory = db.collection('searchHistory');
    searchHistory.insertOne({ subject: req.body.subject });
      
    res.render('pages/results.html', data);
};


async function connectDB() {
    const uri = process.env.DB_URI;
    const options = { useUnifiedTopology: true };
    const client = new MongoClient(uri, options);
    await client.connect();
    return await client.db(process.env.DB_NAME);
}