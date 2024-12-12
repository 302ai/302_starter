import { vi } from "vitest";

// Mock environment variables
vi.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_DEFAULT_MODEL_NAME: "gpt-4o-mini",
    NEXT_PUBLIC_AUTH_API_URL: "https://dash-api.302.ai",
    API_KEY: undefined,
    NEXT_PUBLIC_DEV_HOST_NAME: undefined,
  },
}));

// Mock ky
vi.mock("@/api", () => ({
  authKy: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes("302aitool17-videosum")) {
        return {
          json: () =>
            Promise.resolve({
              code: 0,
              msg: "success",
              data: {
                apiKey: "test-api-key",
                modelName: "gpt-4o-mini",
                region: 1,
                settings: {},
                info: "Test Free Tool",
                status: 1,
              },
            }),
        };
      }
      if (url.includes("jcrs-videosum") && url.includes("pwd=7324")) {
        return {
          json: () =>
            Promise.resolve({
              code: 0,
              msg: "success",
              data: {
                apiKey: "test-api-key",
                modelName: "gpt-4o-mini",
                region: 1,
                settings: {},
                info: "Test Share Code",
                status: 1,
              },
            }),
        };
      }
      return {
        json: () =>
          Promise.resolve({
            code: -99,
            msg: "Invalid access",
            data: {},
          }),
      };
    }),
  },
}));
