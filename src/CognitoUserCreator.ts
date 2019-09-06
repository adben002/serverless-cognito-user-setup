
import * as awsTypes from "../aws-types";
import { AwsCallWrapper } from "./AwsCallWrapper";
import { UserPoolInfo } from "./UserPoolInfo";

export class CognitoUserCreator {

  public constructor(private readonly awsCallWrapper: AwsCallWrapper) {
  }

  public createUsers(userPoolInfo: UserPoolInfo, users: awsTypes.SignUpRequest[]) {

    const outputPromises: Array<Promise<void>> = [];
    for (const user of users) {
      outputPromises.push(
        this._findUser(userPoolInfo, user.Username)
          .then(this._handleUserSignUp(userPoolInfo, user))
          .then(this._handleConfirmSignUp(userPoolInfo, user)),
      );
    }

    return Promise.all(outputPromises);
  }

  private _handleConfirmSignUp(userPoolInfo: UserPoolInfo, currUser: awsTypes.SignUpRequest) {
    return (userRes: awsTypes.UserType) => {
      if (userRes.UserStatus !== "CONFIRMED") {
        return this._confirmSignUpUser(userPoolInfo.userPoolId, currUser.Username);
      }
      return;
    };
  }

  private _handleUserSignUp(userPoolInfo: UserPoolInfo, currUser: awsTypes.SignUpRequest) {
    return (userRes: awsTypes.OpUserType) => {
      if (userRes === undefined) {
        return this._signUpUser(userPoolInfo.userPoolClientId, currUser)
          .then(() => {
            return this._findUser(userPoolInfo, currUser.Username);
          })
          .then((extraUsersRes: awsTypes.OpUserType) => {
            if (extraUsersRes === undefined) {
              throw new Error("Looks like user was not setup.");
            }
            return extraUsersRes;
          });
      }
      return userRes;
    };
  }

  private _findUser(userPoolInfo: UserPoolInfo, username: awsTypes.UsernameType) {

    const listUsersRequest: awsTypes.ListUsersRequest = {
      UserPoolId: userPoolInfo.userPoolId,
      Filter: "username = '" + username + "'",
      Limit: 1,
    };

    return this.awsCallWrapper.listUsers(listUsersRequest)
      .then((usersRes: awsTypes.ListUsersResponse) => {
        if (usersRes.Users === undefined) {
          throw new Error("Looks like call failed.");
        }
        if (usersRes.Users.length === 0) {
          return;
        }
        return usersRes.Users[0];
      });
  }

  private _signUpUser(clientPoolId: awsTypes.ClientIdType, clientData: awsTypes.SignUpRequest) {

    const signUpRequest: awsTypes.SignUpRequest = Object.assign({ ClientId: clientPoolId }, clientData);

    return this.awsCallWrapper.signUp(signUpRequest);
  }

  private _confirmSignUpUser(userPoolId: awsTypes.UserPoolIdType, username: awsTypes.UsernameType) {

    const adminConfirmSignUpRequest: awsTypes.AdminConfirmSignUpRequest = {
      UserPoolId: userPoolId,
      Username: username,
    };

    return this.awsCallWrapper.confirmAdminSignUp(adminConfirmSignUpRequest)
      .then(() => {
        return;
      });
  }

}
