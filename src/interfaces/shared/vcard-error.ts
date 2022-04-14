export type VcardErrorType = 'persistence_error' | 'server_error';

export class VcardError extends Error {
  constructor (public type: VcardErrorType, message?: string) {
    super(message);
  }
  public getSelf = () => {
    return {
      type: this.type,
      message: this.message,
    };
  }
}
