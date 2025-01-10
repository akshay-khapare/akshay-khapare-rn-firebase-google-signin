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
import { googleSignIn, GoogleSignInErrorCode, AppError } from '@akshay-khapare/rn-firebase-google-signin';

const handleGoogleSignIn = async () => {
  try {
    const userCredential = await googleSignIn();
    console.log('User ID:', userCredential.user.uid);
    console.log('User Email:', userCredential.user.email);
    
    // Handle successful sign-in
    return userCredential;
  } catch (error) {
    if (error instanceof AppError) {
      switch (error.code) {
        case GoogleSignInErrorCode.NO_ID_TOKEN:
          console.error('Failed to get ID token from Google');
          // Handle missing ID token error
          break;
          
        case GoogleSignInErrorCode.USER_CREDENTIAL_INVALID:
          console.error('Invalid user credentials');
          // Handle invalid user credential error
          break;
          
        case GoogleSignInErrorCode.PLAY_SERVICES_NOT_AVAILABLE:
          console.error('Google Play Services not available or outdated');
          // Prompt user to install/update Google Play Services
          break;
      }
    } else {
      console.error('Unexpected error during sign-in:', error);
      // Handle unexpected errors
    }
    throw error; // Re-throw if you want to handle it at a higher level
  }
};
```

### Sign Out

```typescript
import { signOut } from '@akshay-khapare/rn-firebase-google-signin';

const handleSignOut = async () => {
  try {
    await signOut();
    console.log('User successfully signed out');
    // Handle successful sign-out
  } catch (error) {
    console.error('Sign-out failed:', error);
    // Handle sign-out error
  }
};
```

### Check Play Services

```typescript
import { checkPlayServices } from '@akshay-khapare/rn-firebase-google-signin';

const handleCheckPlayServices = async () => {
  try {
    await checkPlayServices();
    console.log('Play Services is available and up to date');
    // Handle successful check
  } catch (error) {
    console.error('Play Services error:', error);
    // Handle Play Services error
  }
};
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
- `NO_ID_TOKEN`
- `USER_CREDENTIAL_INVALID`
- `PLAY_SERVICES_NOT_AVAILABLE`

## Error Handling

The package throws `AppError` instances with specific error codes defined in `GoogleSignInErrorCode`:

### Available Error Codes

```typescript
enum GoogleSignInErrorCode {
  NO_ID_TOKEN = "NO_ID_TOKEN",                           // When Google Sign-In fails to provide an ID token
  USER_CREDENTIAL_INVALID = "USER_CREDENTIAL_INVALID",    // When Firebase fails to validate the user credential
  PLAY_SERVICES_NOT_AVAILABLE = "PLAY_SERVICES_NOT_AVAILABLE" // When Google Play Services is missing or outdated
}
```

### Error Scenarios

1. **NO_ID_TOKEN**
   - Occurs when Google Sign-In succeeds but fails to provide an ID token
   - Usually indicates an authentication flow issue

2. **USER_CREDENTIAL_INVALID**
   - Occurs when Firebase cannot validate the Google credential
   - May indicate invalid or expired credentials

3. **PLAY_SERVICES_NOT_AVAILABLE**
   - Occurs when Google Play Services is not installed or needs updating
   - Common on devices without Google Play Services or with outdated versions

## TypeScript Support

The package includes TypeScript definitions. Import types directly:

```typescript
import { 
  GoogleSignInConfig, 
  AppError, 
  GoogleSignInErrorCode 
} from '@akshay-khapare/rn-firebase-google-signin';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
