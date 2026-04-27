export const problemTypes = {
  authenticationFailed: 'https://api.ripples.app/problems/authentication-failed',
  conflict: 'https://api.ripples.app/problems/conflict',
  dependencyFailure: 'https://api.ripples.app/problems/dependency-failure',
  forbidden: 'https://api.ripples.app/problems/forbidden',
  internalServerError: 'https://api.ripples.app/problems/internal-server-error',
  notFound: 'https://api.ripples.app/problems/not-found',
  payloadTooLarge: 'https://api.ripples.app/problems/payload-too-large',
  tooManyRequests: 'https://api.ripples.app/problems/too-many-requests',
  unsupportedMediaType: 'https://api.ripples.app/problems/unsupported-media-type',
  validationError: 'https://api.ripples.app/problems/validation-error',
} as const;
