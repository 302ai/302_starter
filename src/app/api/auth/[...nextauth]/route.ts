import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/env";
import { authKy } from "@/api/auth";
import type { AuthUser, AuthData, AuthResponse } from "@/types/auth";

// Authentication functions
export const verifyApiKey = async (apiKey: string): Promise<AuthResponse> => {
  try {
    // For API key auth, we validate the key exists
    // No need to make an API request since the key is trusted
    return {
      code: 0,
      msg: "success",
      data: {
        apiKey: apiKey,
        modelName: env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
        region: 1,
        settings: {},
        info: "API Key Authentication",
        status: 1,
      },
    };
  } catch (error) {
    console.error("API Key verification error:", error);
    return { code: -99, msg: "Invalid API Key", data: {} };
  }
};

export const verifyFreeToolAccess = async (
  hostname: string
): Promise<AuthResponse> => {
  try {
    // Try to access the endpoint without pwd to check if it's a free tool
    const response = await authKy
      .get(`bot/v1/${hostname}`)
      .json<AuthResponse>();
    console.debug("Free tool verification response:", response);
    return response;
  } catch (error) {
    console.error("Free tool verification error:", error);
    return { code: -99, msg: "Invalid free tool access", data: {} };
  }
};

export const verifyShareCode = async (
  hostname: string,
  pwd: string
): Promise<AuthResponse> => {
  try {
    // Regular authentication with hostname and pwd
    const response = await authKy
      .get(`bot/v1/${hostname}?pwd=${pwd}`)
      .json<AuthResponse>();
    console.debug("Share code verification response:", response);
    return response;
  } catch (error) {
    console.error("Share code verification error:", error);
    return { code: -99, msg: "Invalid share code", data: {} };
  }
};

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "apikey",
      name: "API Key",
      credentials: {
        apiKey: { label: "API Key", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.apiKey) return null;

          // Server-side API key takes precedence
          const apiKey = env.API_KEY || credentials.apiKey;
          const response = await verifyApiKey(apiKey);

          if (response.code === 0) {
            const data = response.data as AuthData;
            return {
              id: "api-key-user",
              name: "API Key User",
              apiKey: data.apiKey,
              modelName: data.modelName,
              region: data.region,
              settings: data.settings,
              info: data.info,
              hideBrand: env.NEXT_PUBLIC_HIDE_BRAND ?? false,
              status: data.status,
              authType: "apiKey" as const,
              extraData: data.extraData,
            };
          }
          return null;
        } catch (error) {
          console.error("API Key authentication error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "sharecode",
      name: "Share Code",
      credentials: {
        hostname: { label: "Hostname", type: "text" },
        pwd: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.hostname) return null;

        try {
          // If server-side API key exists, ignore other auth methods
          if (env.API_KEY) return null;

          // Check for development mode
          if (
            env.NEXT_PUBLIC_DEV_HOST_NAME &&
            credentials.hostname === env.NEXT_PUBLIC_DEV_HOST_NAME &&
            credentials.pwd === "7324"
          ) {
            return {
              id: "dev-user",
              name: "Development User",
              apiKey: "dev-api-key",
              modelName: env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
              region: 1,
              settings: {},
              info: "Development Mode",
              hideBrand: env.NEXT_PUBLIC_HIDE_BRAND ?? false,
              status: 1,
              authType: "shareCode" as const,
              extraData: {},
            };
          }

          // Try free tool authentication first
          const freeToolResponse = await verifyFreeToolAccess(
            credentials.hostname
          );

          if (freeToolResponse.code === 0) {
            const data = freeToolResponse.data as AuthData;
            return {
              id: data.createdBy || "free-tool-user",
              name: data.createdBy || "Free Tool User",
              apiKey: data.apiKey,
              modelName: data.modelName,
              region: data.region,
              settings: data.settings,
              info: data.info,
              hideBrand: env.NEXT_PUBLIC_HIDE_BRAND ?? false,
              status: data.status,
              authType: "freeTool" as const,
              extraData: data.extraData,
            };
          }

          // Try regular authentication if pwd is provided
          if (credentials.pwd) {
            const response = await verifyShareCode(
              credentials.hostname,
              credentials.pwd
            );

            if (response.code === 0) {
              const data = response.data as AuthData;
              return {
                id: data.createdBy || "auth-user",
                name: data.createdBy || "Authenticated User",
                apiKey: data.apiKey,
                modelName: data.modelName,
                region: data.region,
                settings: data.settings,
                info: data.info,
                hideBrand: env.NEXT_PUBLIC_HIDE_BRAND ?? false,
                status: data.status,
                authType: "shareCode" as const,
                extraData: data.extraData,
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Share code authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as AuthUser;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as AuthUser;
      }
      return session;
    },
  },
  pages: {
    signIn: env.NEXT_PUBLIC_AUTH_PATH,
    error: env.NEXT_PUBLIC_AUTH_PATH,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
