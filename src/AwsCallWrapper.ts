
import * as awsTypes from "../aws-types";

export class AwsCallWrapper {

  public constructor(private readonly awsProvider: awsTypes.AwsProvider) {
  }

  public listUsers(listUsersRequest: awsTypes.ListUsersRequest): Promise<awsTypes.ListUsersResponse> {

    return this.awsProvider.request("CognitoIdentityServiceProvider",
      "listUsers",
      listUsersRequest,
      this.awsProvider.getStage(),
      this.awsProvider.getRegion(),
    );
  }

  public signUp(signUpRequest: awsTypes.SignUpRequest): Promise<awsTypes.SignUpResponse> {

    return this.awsProvider.request("CognitoIdentityServiceProvider",
      "signUp",
      signUpRequest,
      this.awsProvider.getStage(),
      this.awsProvider.getRegion(),
    );
  }

  public confirmAdminSignUp(adminConfirmSignUpRequest: awsTypes.AdminConfirmSignUpRequest):
    Promise<awsTypes.AdminConfirmSignUpResponse> {

    return this.awsProvider.request("CognitoIdentityServiceProvider",
      "adminConfirmSignUp",
      adminConfirmSignUpRequest,
      this.awsProvider.getStage(),
      this.awsProvider.getRegion(),
    );
  }

  public listUserPoolClients(listUserPoolClientsRequest: awsTypes.ListUserPoolClientsRequest):
    Promise<awsTypes.ListUserPoolClientsResponse> {

    return this.awsProvider.request("CognitoIdentityServiceProvider",
      "listUserPoolClients",
      listUserPoolClientsRequest,
      this.awsProvider.getStage(),
      this.awsProvider.getRegion(),
    );
  }

  public listUserPools(listUserPoolsRequest: awsTypes.ListUserPoolsRequest):
    Promise<awsTypes.ListUserPoolsResponse> {

    return this.awsProvider.request("CognitoIdentityServiceProvider",
      "listUserPools",
      listUserPoolsRequest,
      this.awsProvider.getStage(),
      this.awsProvider.getRegion(),
    );
  }

}
