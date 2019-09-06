
import * as awsTypes from "../aws-types";

export class UserPoolInfo {

  constructor(readonly userPoolId: awsTypes.UserPoolIdType,
              readonly userPoolClientId: awsTypes.ClientIdType) {
  }

}
