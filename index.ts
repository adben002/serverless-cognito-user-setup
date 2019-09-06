
import * as awsTypes from "./aws-types";
import { AwsCallWrapper } from "./src/AwsCallWrapper";
import { CognitoUserCreator } from "./src/CognitoUserCreator";
import { UserPoolClientFinder } from "./src/UserPoolClientFinder";
import { UserPoolFinder } from "./src/UserPoolFinder";
import { UserPoolInfo } from "./src/UserPoolInfo";

class AWSCognitoUserSetup {

  private static _validateConfig(cognitoUserSetupConfigParam: any): any {
    if (cognitoUserSetupConfigParam.userPoolName === undefined) {
      throw new Error("Require userPoolName");
    }
    if (cognitoUserSetupConfigParam.userPoolClientName === undefined) {
      throw new Error("Require userPoolClientName");
    }
    if (cognitoUserSetupConfigParam.users === undefined) {
      throw new Error("Require users");
    }
    return cognitoUserSetupConfigParam;
  }

  private readonly userPoolFinder: UserPoolFinder;
  private readonly userPoolClientFinder: UserPoolClientFinder;
  private readonly cognitoUserCreator: CognitoUserCreator;

  private readonly hooks: {};
  private readonly cognitoUserSetupConfig: any;

  constructor(readonly serverless: Serverless) {
    const awsCallWrapper: AwsCallWrapper = new AwsCallWrapper(serverless.getProvider("aws"));

    this.userPoolFinder = new UserPoolFinder(awsCallWrapper);
    this.userPoolClientFinder = new UserPoolClientFinder(awsCallWrapper);
    this.cognitoUserCreator = new CognitoUserCreator(awsCallWrapper);

    const custom: any = serverless.service.custom;
    this.cognitoUserSetupConfig = AWSCognitoUserSetup._validateConfig(custom.cognitoUserSetup);

    this.hooks = {
      "after:deploy:finalize": () =>
        Promise.resolve().then(this._makeAdmin.bind(this)),
    };
  }

  private _makeAdmin(): Promise<void[]> {
    return this.userPoolFinder.findUserPool(this.cognitoUserSetupConfig.userPoolName)
      .then((userPoolId: string) => {
        return this.userPoolClientFinder
          .findUserPoolClient(userPoolId, this.cognitoUserSetupConfig.userPoolClientName);
      }).then((userPoolInfo: UserPoolInfo) => {
        return this.cognitoUserCreator.createUsers(userPoolInfo, this.cognitoUserSetupConfig.users);
      });
  }

}

export = AWSCognitoUserSetup;
