export class AuthenticationRequest {

  constructor(data:Partial<AuthenticationRequest>) {
    Object.assign(this, data);
  }

  username?: string|null;
  password?: string|null;

}

export class AuthenticationResponse {
  accessToken?: string;
}
