export class RpcAuthenticationPayloadDto {
  authentication: string;

  constructor(data: { authentication: string }) {
    Object.assign(this, data);
  }
}
