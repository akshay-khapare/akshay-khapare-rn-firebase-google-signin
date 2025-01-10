import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

enum GoogleSignInErrorCode {
  NO_ID_TOKEN = "NO_ID_TOKEN",
  USER_CREDENTIAL_INVALID = "USER_CREDENTIAL_INVALID",
  PLAY_SERVICES_NOT_AVAILABLE = "PLAY_SERVICES_NOT_AVAILABLE",
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

const errorMessages = {
  signInFailed: "Google sign-in failed",
  playServicesNotAvailable: "Google Play services not available or outdated",
  userCredentialInvalid: "User credential is invalid or user does not exist.",
};

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

export const googleSignIn =
  async (): Promise<FirebaseAuthTypes.UserCredential> => {
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
    const userCredential = await auth().signInWithCredential(googleCredential);

    if (!userCredential.user) {
      throw new AppError(
        errorMessages.userCredentialInvalid,
        GoogleSignInErrorCode.USER_CREDENTIAL_INVALID
      );
    }

    return userCredential;
  };

export const signOut = async (): Promise<void> => {
  await GoogleSignin.signOut();
  await auth().signOut();
};

export const init = (config: GoogleSignInConfig): void => {
  GoogleSignin.configure({
    webClientId: config.webClientId,
    offlineAccess: config.offlineAccess ?? true,
  });
};

export { statusCodes, GoogleSignInConfig, AppError, GoogleSignInErrorCode };
