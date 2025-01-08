import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export { statusCodes };

const errorMessages = {
  signInFailed: "Google sign-in failed",
  signInCancelled: "Sign-in was cancelled",
  signInAlreadyInProgress: "Sign-in is already in progress",
  signOutFailed: "Sign-out failed",
  playServicesNotAvailable: "Google Play services not available or outdated",
  networkError: "Network error occurred",
  invalidCredentials: "Invalid credentials",
  userCredentialInvalid: "User credential is invalid or user does not exist.",
};

enum GoogleSignInErrorCode {
  SIGN_IN_CANCELLED = "SIGN_IN_CANCELLED",
  SIGN_IN_FAILED = "SIGN_IN_FAILED",
  IN_PROGRESS = "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE = "PLAY_SERVICES_NOT_AVAILABLE",
  NETWORK_ERROR = "NETWORK_ERROR",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NO_ID_TOKEN = "NO_ID_TOKEN",
  SIGN_OUT_FAILED = "SIGN_OUT_FAILED",
  USER_CREDENTIAL_INVALID = "USER_CREDENTIAL_INVALID",
}

class AppError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = "AppError";
  }
}

interface GoogleSignInConfig {
  webClientId: string;
  offlineAccess?: boolean;
}

interface GoogleSignInResult {
  userCredential: FirebaseAuthTypes.UserCredential | null;
  error?: AppError;
}

/**
 * Checks if Google Play Services is available and up to date
 * @throws {AppError} If Play Services is not available or outdated
 */
const checkPlayServices = async (): Promise<void> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  } catch (error) {
    throw new AppError(
      errorMessages.playServicesNotAvailable,
      GoogleSignInErrorCode.PLAY_SERVICES_NOT_AVAILABLE
    );
  }
};

/**
 * Signs in the user with Google and Firebase
 * @returns Promise resolving to FirebaseAuthTypes.UserCredential
 */
export const googleSignIn =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
    try {
      // Ensure clean state by signing out first
      await signOut();
      await checkPlayServices();

      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        throw new AppError(
          errorMessages.signInFailed,
          GoogleSignInErrorCode.NO_ID_TOKEN
        );
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      if (!userCredential.user) {
        throw new AppError(
          errorMessages.userCredentialInvalid,
          GoogleSignInErrorCode.USER_CREDENTIAL_INVALID
        );
      }

      return userCredential;
    } catch (error: any) {
      let errorMessage = errorMessages.signInFailed;
      let errorCode = GoogleSignInErrorCode.SIGN_IN_FAILED;

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = errorMessages.signInCancelled;
        errorCode = GoogleSignInErrorCode.SIGN_IN_CANCELLED;
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        errorMessage = errorMessages.signInAlreadyInProgress;
        errorCode = GoogleSignInErrorCode.IN_PROGRESS;
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = errorMessages.playServicesNotAvailable;
        errorCode = GoogleSignInErrorCode.PLAY_SERVICES_NOT_AVAILABLE;
      } else if (error?.code === "auth/invalid-credential") {
        errorMessage = errorMessages.invalidCredentials;
        errorCode = GoogleSignInErrorCode.INVALID_CREDENTIALS;
      } else if (error?.message?.includes("network")) {
        errorMessage = errorMessages.networkError;
        errorCode = GoogleSignInErrorCode.NETWORK_ERROR;
      }

      throw new AppError(errorMessage, errorCode);
    }
  };

/**
 * Signs out the user from Google and Firebase
 * @throws {AppError} If sign-out fails
 */
export const signOut = async (): Promise<void> => {
  try {
    const isSignedIn = await GoogleSignin.hasPreviousSignIn();
    if (isSignedIn) {
      await Promise.all([
        GoogleSignin.revokeAccess(),
        GoogleSignin.signOut(),
        auth().signOut(),
      ]);
    }
  } catch (error) {
    console.error("[GoogleSignIn] Sign-out failed:", error);
    throw new AppError(
      errorMessages.signOutFailed,
      GoogleSignInErrorCode.SIGN_OUT_FAILED
    );
  }
};

/**
 * Initialize Google Sign-In configuration
 * @param config - Configuration options for Google Sign-In
 */
export const init = (config: GoogleSignInConfig): void => {
  GoogleSignin.configure({
    webClientId: config.webClientId,
    offlineAccess: config.offlineAccess ?? true,
  });
};

export {
  GoogleSignInConfig,
  GoogleSignInResult,
  AppError,
  GoogleSignInErrorCode,
};
