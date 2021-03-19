import userSettingsModel from '@models/user.settings.model';
import userModel from '@models/user.model';

function setHasSetupAccount(id) {
  userModel.findOneAndUpdate({ _id: id }, { hasSetupAccount: true });
}

export default {
  createNewUserProfile: (userID, { name }) => {
    const newUserSettingsProfile = new userSettingsModel({
      userID,
      name,
    });

    newUserSettingsProfile.save((error) => {
      if (!error) {
        setHasSetupAccount(userID);
      }
    });
  },
  setLikedCompany: (userID, symbol) => {
    userSettingsModel
      .findOneAndUpdate({ userID }, { $push: { likedCompanies: symbol } })
      .then((profile) => profile);
  },
  setDislikedCompany: (userID, symbol) => {
    userSettingsModel
      .findOneAndUpdate({ userID }, { $push: { dislikedCompanies: symbol } })
      .then((profile) => profile);
  },
  getUserProfile: (userID) =>
    userSettingsModel
      .findOne({ userID })
      .lean()
      .then((profile) => profile),
};
