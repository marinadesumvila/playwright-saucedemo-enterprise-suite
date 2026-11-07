export interface UserCredentials {
  username: string;
  password: string;
  description: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CustomerProfile extends UserCredentials {
  address?: AddressData;
}

export interface UserCatalog {
  standardUser: UserCredentials;
  lockedUser: UserCredentials;
  problemUser: UserCredentials;
  performanceGlitchUser: UserCredentials;
  invalidUser: UserCredentials;
}
