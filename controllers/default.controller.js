import fetch from 'node-fetch';
import dotenv from 'dotenv';
import userSettingsController from './database/users.settings.controller';

dotenv.config();

export function home(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'We are MA stock',
    description:
      'A young and very passionate agency specialized in the stock market. With us you will find the shares of companies that best suit your preferen- ces.',
    verification: req.session.verification,
  };

  res.render('pages/home.html', data);
}

export async function overview(req, res) {
  // TODO dynamicaly fill companies array
  const symbols = [
    'AACG',
    'AACQ',
    'AAIC',
    'AAL',
    'AAMC',
    'AAME',
    'AAN',
    'AAOI',
    'AAON',
    'AAP',
    'AAPL',
    'AAT',
    'AAU',
  ];

  const companyData = symbols.map((symbol) => {
    return fetch(
      `${process.env.API_URL}/stock/profile2?symbol=${symbol}&token=${process.env.API_KEY}`,
    )
      .then((res) => res.json())
      .then((companyData) => {
        return {
          symbol,
          exchange: companyData.exchange,
          currency: companyData.currency,
          name: companyData.name,
          industry: companyData.finnhubIndustry,
          country: companyData.country,
          weburl: companyData.weburl,
        };
      });
  });

  Promise.all(companyData).then(async (companies) => {
    const data = {
      layout: 'layout.html',
      title: 'Overview page',
      companies,
    };

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
  });
}

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
    return { symbol: company };
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
