
import * as awsTypes from "../aws-types";
import { AwsCallWrapper } from "./AwsCallWrapper";

export class UserPoolFinder {

  private static _findMatchingUserPoolId(userPools: awsTypes.UserPoolListType,
                                         userPoolName: awsTypes.UserPoolNameType): awsTypes.UserPoolIdType | undefined {

    for (const userPool of userPools) {
      if (userPool.Name === userPoolName) {
        return userPool.Id;
      }
    }
    return;
  }

  public constructor(private readonly awsCallWrapper: AwsCallWrapper) {
  }

  public findUserPool(userPoolName: awsTypes.PaginationKeyType): Promise<awsTypes.UserPoolNameType> {
    return this._findUserPool(userPoolName);
  }

  private _findUserPool(userPoolName: awsTypes.UserPoolNameType, nextToken?: awsTypes.PaginationKeyType):
    Promise<awsTypes.UserPoolNameType> {

    return this._listUserPools(nextToken)
      .then((res: awsTypes.ListUserPoolsResponse) => {
        if (res.UserPools === undefined) {
          throw new Error("User pools call failed");
        }
        const userPools: awsTypes.UserPoolListType = res.UserPools;
        if (userPools.length === 0) {
          throw new Error("Could not find user pool: " + userPoolName);
        }
        const matchingPool = UserPoolFinder._findMatchingUserPoolId(userPools, userPoolName);
        return matchingPool ? matchingPool : this._findUserPool(userPoolName, res.NextToken);
      });
  }

  private _listUserPools(nextToken?: awsTypes.PaginationKeyType): Promise<awsTypes.ListUserPoolsResponse> {

    const listUserPoolsRequest: awsTypes.ListUserPoolsRequest = {
      NextToken: nextToken,
      MaxResults: 10,
    };

    return this.awsCallWrapper.listUserPools(listUserPoolsRequest);
  }

}
