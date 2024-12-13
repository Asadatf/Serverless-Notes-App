export const BASE_URL =
  "https://zzxkvlrvek.execute-api.us-east-1.amazonaws.com/prod";

export const API_ROUTES = {
  LOGIN: `${BASE_URL}/api/user/login`,
  SIGNUP: `${BASE_URL}/api/user/signup`,
  NOTES: `${BASE_URL}/api/notes`,
  FORGET_PASSWORD: `${BASE_URL}/api/user/forgetPassword`,
  RESET_PASSWORD: `${BASE_URL}/api/user/reset-password`,
  USER_PROFILE: `${BASE_URL}/api/user/profile`,
};
