import mongoose from 'mongoose';
import userSettingsModel from '../../models/user.settings.model';
import userModel from '../../models/user.model';

export default {
  createNewUserProfile: (userID, { name }) => {
    //TODO check if a user profile already exists for this is
    const newUserSettingsProfile = new userSettingsModel({
      userID: userID,
      name: name,
    });

    newUserSettingsProfile.save((error) => {
      error
        ? console.log(`Something went wrong: ${error}`)
        : setHasSetupAccount(userID);
    });
  },
};

function setHasSetupAccount(id) {
  console.log(id);
  userModel.findOneAndUpdate({ _id: id }, { hasSetupAccount: true });
}
