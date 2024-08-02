export interface ExternalAuthDto {
    provider: string;
    idToken: string;
  }

  export interface AuthResponseDto {
    isAuthSuccessful: boolean;
    errorMessage: string;
    token: string;
    is2StepVerificationRequired: boolean;
    provider: string;
}