import userSettingsController from './database/users.settings.controller';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export function home(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Home page',
  };

  res.render('pages/home.html', data);
}

export async function overview(req, res) {
  // TODO dynamicaly fill companies array
  fetch(`http://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=${process.env.API_KEY}`)
    .then(res => res.json())
    .then((companyData) => {
      const data = {
        layout: 'layout.html',
        title: 'Overview page',
        companies: [{
          exchange: companyData.exchange,
          currency: companyData.currency,
          name: companyData.name,
          logo: companyData.logo,
          symbol: companyData.ticker,
          industry: companyData.finnhubIndustry,
          country: companyData.country,
          weburl: companyData.weburl
        }]
      }
      console.log(data.companies);
    });
  const userProfile = await userSettingsController.getUserProfile(
    req.session.userID,
  );

  data.companies = data.companies.filter((company) => {
    if (
      userProfile.likedCompanies.includes(company.symbol) === false &&
      userProfile.dislikedCompanies.includes(company.symbol) === false
    ) {
      return company;
    }
    return false;
  });
  res.render('pages/overview.html', data);
};

overview();

export async function overviewPost(req, res) {
  if (req.body.like === 'false') {
    userSettingsController.setDislikedCompany(
      req.session.userID,
      req.body.symbol,
    );
  } else {
    userSettingsController.setLikedCompany(req.session.userID, req.body.symbol);
  }

  res.redirect('/overview');
}

export async function matchesOverview(req, res) {
  const profile = await userSettingsController.getUserProfile(
    req.session.userID,
  );

  // TODO fetch company information and put info into data.matches
  const companies = profile.likedCompanies.map((company) => {
    return {
      symbol: company
    };
  });

  const data = {
    layout: 'layout.html',
    title: 'Matches',
    matches: companies,
  };

  res.render('pages/matches-overview.html', data);
}

export async function matchesOverviewPost(req, res) {
  userSettingsController.removeMatch(req.session.userID, req.body.symbol);
  res.redirect('/matches-overview');
}

export function notFound(req, res) {
  res.send('page not found');
}