import { describe, it, expect } from "vitest";
import { env } from "@/env";
import {
  verifyApiKey,
  verifyFreeToolAccess,
  verifyShareCode,
} from "@/app/api/auth/[...nextauth]/route";

describe("Authentication Tests", () => {
  describe("API Key Authentication", () => {
    it("should validate API key", async () => {
      const response = await verifyApiKey("test-api-key");
      expect(response.code).toBe(0);
      expect(response.data.apiKey).toBeDefined();
      expect(response.data.modelName).toBe(env.NEXT_PUBLIC_DEFAULT_MODEL_NAME);
    });
  });

  describe("Free Tool Authentication", () => {
    it("should verify free tool access", async () => {
      const response = await verifyFreeToolAccess("302aitool17-videosum");
      expect(response.code).toBe(0);
      expect(response.data.apiKey).toBeDefined();
    });

    it("should handle invalid free tool", async () => {
      const response = await verifyFreeToolAccess("invalid-hostname");
      expect(response.code).toBe(-99);
    });
  });

  describe("Share Code Authentication", () => {
    it("should verify valid share code", async () => {
      const response = await verifyShareCode("jcrs-videosum", "7324");
      expect(response.code).toBe(0);
      expect(response.data.apiKey).toBeDefined();
    });

    it("should handle invalid share code", async () => {
      const response = await verifyShareCode("jcrs-videosum", "invalid");
      expect(response.code).toBe(-99);
    });
  });
});
