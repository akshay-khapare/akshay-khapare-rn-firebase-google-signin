# rn-firebase-google-signin

A streamlined React Native package that simplifies Google Sign-In integration with Firebase Authentication. Written in TypeScript for type safety and better developer experience.

> **Note**: This package was created for personal project use. While it's functional and well-documented, it may not be actively maintained or suitable for production use in other projects. Feel free to use it as a reference or adapt it for your needs.

## Features

- 🔐 Seamless Google Sign-In integration
- 🔥 Firebase Authentication support
- 📱 React Native compatible
- 💪 Written in TypeScript
- ⚡ Async/await support
- 🛠 Easy configuration
- 🔄 Automatic token refresh
- 📋 Comprehensive error handling

## Installation

```bash
npm install @akshay-khapare/rn-firebase-google-signin
# or
yarn add @akshay-khapare/rn-firebase-google-signin
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "@react-native-firebase/app": ">=18.0.0",
  "@react-native-firebase/auth": ">=18.0.0",
  "@react-native-google-signin/google-signin": "^13.1.0",
  "react": ">=16.8.0",
  "react-native": ">=0.60.0"
}
```

Install them using:

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-google-signin/google-signin
# or
yarn add @react-native-firebase/app @react-native-firebase/auth @react-native-google-signin/google-signin
```

## Android Setup

1. Configure your `android/build.gradle`:
```gradle
buildscript {
    ext {
        googlePlayServicesAuthVersion = "20.7.0"
    }

    dependencies {
        classpath('com.google.gms:google-services:4.4.1')
    }
}
```

2. Configure your `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

3. Add Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Add your Android app to the Firebase project
   - Download `google-services.json` from Firebase Console
   - Place it in `android/app/`
   - Add your SHA-1 signing certificate fingerprint in Firebase project settings under your Android app
   - Follow [Firebase setup guide](https://rnfirebase.io/#installation) for complete setup

## Setup

1. Configure Firebase in your React Native project
2. Set up Google Sign-In in Firebase Console
3. Initialize the package in your app:

```typescript
import { init } from '@akshay-khapare/rn-firebase-google-signin';

// Initialize with your web client ID from Google Cloud Console
init({
  webClientId: 'your-web-client-id',
  offlineAccess: true // Optional, defaults to true
});
```

## Usage

### Sign In

```typescript
import { googleSignIn, GoogleSignInErrorCode } from '@akshay-khapare/rn-firebase-google-signin';

try {
  const userCredential = await googleSignIn();
  // User successfully signed in
  console.log('User ID:', userCredential.user.uid);
  console.log('User Email:', userCredential.user.email);
} catch (error) {
  // Error is an instance of AppError with code and message
  console.error('Sign-in error:', {
    code: error.code,
    message: error.message
  });
  
  // You can handle specific error cases
  switch (error.code) {
    case GoogleSignInErrorCode.SIGN_IN_CANCELLED:
      console.log('User cancelled the sign-in');
      break;
    case GoogleSignInErrorCode.PLAY_SERVICES_NOT_AVAILABLE:
      console.log('Play Services not available or outdated');
      break;
    case GoogleSignInErrorCode.NETWORK_ERROR:
      console.log('Network error occurred');
      break;
    case GoogleSignInErrorCode.INVALID_CREDENTIALS:
      console.log('Invalid credentials');
      break;
    default:
      console.log('Sign-in failed:', error.message);
  }
}
```

### Sign Out

```typescript
import { signOut } from '@akshay-khapare/rn-firebase-google-signin';

try {
  await signOut();
  // User successfully signed out
} catch (error) {
  console.error('Sign-out error:', error);
}
```

### Check Play Services

```typescript
import { checkPlayServices } from '@akshay-khapare/rn-firebase-google-signin';

try {
  await checkPlayServices();
  // Play Services is available and up to date
} catch (error) {
  console.error('Play Services error:', error);
}
```

## API Reference

### Functions

#### `init(config: GoogleSignInConfig): void`
Initializes the Google Sign-In configuration.
- `config.webClientId`: string (required) - Your web client ID from Google Cloud Console
- `config.offlineAccess`: boolean (optional) - Enable offline access, defaults to true

#### `googleSignIn(): Promise<GoogleSignInResult>`
Initiates the Google Sign-In flow.
- Returns: Promise resolving to `GoogleSignInResult`
  - `userCredential`: Firebase UserCredential object or null
  - `error`: AppError object (if an error occurred)

#### `signOut(): Promise<void>`
Signs out the current user from both Google and Firebase.

#### `checkPlayServices(): Promise<void>`
Checks if Google Play Services is available and up to date.

### Types

#### `GoogleSignInConfig`
```typescript
{
  webClientId: string;
  offlineAccess?: boolean;
}
```

#### `GoogleSignInResult`
```typescript
{
  userCredential: FirebaseAuthTypes.UserCredential | null;
  error?: AppError;
}
```

#### `GoogleSignInErrorCode`
Enum of possible error codes:
- `SIGN_IN_CANCELLED`
- `SIGN_IN_FAILED`
- `IN_PROGRESS`
- `PLAY_SERVICES_NOT_AVAILABLE`
- `NETWORK_ERROR`
- `INVALID_CREDENTIALS`
- `NO_ID_TOKEN`
- `SIGN_OUT_FAILED`

## Error Handling

The package uses custom `AppError` class for error handling:

```typescript
class AppError extends Error {
  code?: string;
  // The error code will be one of GoogleSignInErrorCode values
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
