export class PasswordResetRequest {

  constructor(data:Partial<PasswordResetRequest>) {
    Object.assign(this, data);
  }

  email?: string|null;

}

export class PasswordResetCompleteRequest {

  constructor(data:Partial<PasswordResetCompleteRequest>) {
    Object.assign(this, data);
  }

  uid?: string|null;
  newPassword?: string|null;

}
