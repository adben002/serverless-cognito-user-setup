
import * as awsTypes from "../aws-types";
import { AwsCallWrapper } from "./AwsCallWrapper";
import { UserPoolInfo } from "./UserPoolInfo";

export class UserPoolClientFinder {

  private static _findMatchingUserPoolClientId(userClientPools: awsTypes.UserPoolClientListType,
                                               userPoolClientName: awsTypes.ClientNameType)
    : awsTypes.ClientNameType | undefined {

    for (const userClientPool of userClientPools) {
      if (userClientPool.ClientName === userPoolClientName) {
        return userClientPool.ClientId;
      }
    }
    return;
  }

  public constructor(private readonly awsCallWrapper: AwsCallWrapper) {
  }

  public findUserPoolClient(userPoolId: awsTypes.UserPoolIdType,
                            userPoolClientName: awsTypes.ClientNameType): Promise<UserPoolInfo> {

    return this._findUserPoolClient(userPoolId, userPoolClientName);
  }

  private _findUserPoolClient(userPoolId: awsTypes.UserPoolIdType,
                              userPoolClientName: awsTypes.ClientNameType,
                              nextToken?: awsTypes.PaginationKeyType): Promise<UserPoolInfo> {

    return this._listUserPoolClients(userPoolId, nextToken)
      .then<UserPoolInfo>((res) => {
        if (res.UserPoolClients === undefined) {
          throw new Error("Error in user pool clients call");
        }
        const userClientPools: awsTypes.UserPoolClientListType = res.UserPoolClients;
        if (userClientPools.length === 0) {
          throw new Error("Could not find user pool client: " + userPoolClientName + ", in: " + userPoolId);
        }
        const matchingPool = UserPoolClientFinder._findMatchingUserPoolClientId(userClientPools, userPoolClientName);
        return matchingPool ? new UserPoolInfo(userPoolId, matchingPool) :
          this._findUserPoolClient(userPoolId, userPoolClientName, res.NextToken);
      });
  }

  private _listUserPoolClients(userPoolId: awsTypes.UserPoolIdType,
                               nextToken?: awsTypes.PaginationKeyType): Promise<awsTypes.ListUserPoolClientsResponse> {

    const listUserPoolClientsRequest: awsTypes.ListUserPoolClientsRequest = {
      UserPoolId: userPoolId,
      NextToken: nextToken,
      MaxResults: 10,
    };

    return this.awsCallWrapper.listUserPoolClients(listUserPoolClientsRequest);
  }

}
