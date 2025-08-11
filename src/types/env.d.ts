declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Required environment variables
      NEXT_PUBLIC_BASE_URL: string;
    }
  }
}

export {};
