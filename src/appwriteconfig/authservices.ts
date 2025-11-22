import { account, oauthProvider } from "./config";

export const loginWithGoogle = async () => {
  account.createOAuth2Session(
    oauthProvider.Google,
    import.meta.env.VITE_OAUTH_SUCCESS_REDIRECT,
    import.meta.env.VITE_OAUTH_FAILURE_REDIRECT
  );
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw error;
  }
};

export const createAccount = async (email: string, password: string, name: string) => {
  try {
    return await account.create("unique()", email, password, name);
  } catch (error) {
    throw error;
  }
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
