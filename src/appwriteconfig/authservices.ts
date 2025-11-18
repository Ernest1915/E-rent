import { account, oauthProvider } from "./config";

export const loginWithGoogle = async () => {
  account.createOAuth2Session(
    oauthProvider.Google,
    import.meta.env.VITE_OAUTH_SUCCESS_REDIRECT,
    import.meta.env.VITE_OAUTH_FAILURE_REDIRECT
  );
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw error;
  }
};
