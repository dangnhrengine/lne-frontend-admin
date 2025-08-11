// Type definitions for our i18n messages structure
export interface Messages {
  app: {
    name: string;
    description: string;
  };
  common: {
    loading: string;
    notFound: string;
    error: string;
    defaultUserName: string;
  };
  navigation: {
    home: string;
  };
  header: {
    title: string;
    welcome: string;
    login: string;
    logout: string;
  };
  footer: {
    title: string;
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    loginSuccess: string;
    loginError: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
  };
}

declare global {
  // Use type safe message keys with `next-intl`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}

export {};
