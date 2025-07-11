export class AuthenticationRequest {

  constructor(data:Partial<AuthenticationRequest>) {
    Object.assign(this, data);
  }

  username?: string|null;
  password?: string|null;

}

export class AuthenticationResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  tokenExpiry?: string;
  user?: {
    id: string;
    username: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  permissions?: string[];
}
