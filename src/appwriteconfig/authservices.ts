import { account } from "./config";
export const createAccount  = async(email: string, password: string, name: string) => {
    try {
        const res = account.create('unique()', email, password, name);
        return res
    }catch (error) {
        throw error;
      }
    
};
export const login = async (email: string, password: string) => {
    try {
      const res = await account.createSession(email, password);
      return res;
    } catch (error) {
      throw error;
    }
  };
  export const getCurrentUser = async () => {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  };
  export const logout = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw error;
    }
  };  