import { MongoClient } from 'mongodb';

export async function yourMatchesGet(req, res){
    const data = {
        layout: 'layout.html',
        title: 'result page',
      }
    const db = await connectDB();
    const accounts = await db.collection('Accounts').find({}).toArray();

    data.accounts = accounts;
    
    res.render('pages/yourMatches.html', data)
}

export async function yourMatchesPost(req, res){
    const db = await connectDB();
    const accounts = await db.collection('Accounts').find({}).toArray();
    const searched = (req.body.searchedSubject);
    const filteredSubject = accounts.filter(function (Accounts) {
        return Accounts.matchedSubject.includes(req.body.searchedSubject);
    });
    const data = {
        layout: 'layout.html',
        title: 'result page',
        matchQuantity: filteredSubject.length,
        searchedThisSubject: searched,
        account: filteredSubject
    }
       
    // toevoegen van gezochte onderwerp naar database 
    const searchHistory = db.collection('searchHistory');
    searchHistory.insertOne({ matchedSubject: req.body.searchedSubject });
      
    res.render('pages/yourMatches.html', data);
};

async function connectDB() {
    const uri = process.env.DB_URI;
    const options = { useUnifiedTopology: true };
    const client = new MongoClient(uri, options);
    await client.connect();
    return await client.db(process.env.DB_NAME);
}