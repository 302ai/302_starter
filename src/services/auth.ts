"use client";

import { env } from "@/env";
import { signIn } from "next-auth/react";
import { logger } from "@/utils";

export interface LoginResult {
  success: boolean;
  data?: {
    code: string;
    info: string;
    apiKey: string;
    modelName: string;
    region: string;
    hideBrand: boolean;
  };
}

export const login = async (code?: string): Promise<LoginResult> => {
  try {
    const hostname =
      env.NEXT_PUBLIC_DEV_HOST_NAME || window.location.host.split(".")[0];
    logger.debug("Attempting login with hostname:", hostname);

    // Try API Key authentication first if available (handled server-side)
    if (env.API_KEY) {
      logger.debug("Using server-side API key authentication");
      const result = await signIn("apikey", {
        redirect: false,
      });

      if (result?.error) {
        logger.error("API key authentication failed:", result.error);
        throw new Error(result.error);
      }

      return { success: true };
    }

    // Try share code authentication
    logger.debug("Attempting share code authentication");
    const result = await signIn("sharecode", {
      hostname,
      pwd: code,
      redirect: false,
    });

    if (result?.error) {
      let errorMessage = "global.error.unknow_error";

      if (result.error === "network_error") {
        errorMessage = "global.error.network_error";
      } else if (result.error === "tool_deleted") {
        errorMessage = "global.error.tool_deleted";
      } else if (result.error === "tool_disabled") {
        errorMessage = "global.error.tool_disabled";
      } else if (result.error === "code_invalid") {
        errorMessage = "global.error.code_invalid";
      }

      logger.error("Share code authentication failed:", errorMessage);
      throw new Error(errorMessage);
    }

    logger.debug("Authentication successful");
    return { success: true };
  } catch (error) {
    logger.error("Authentication error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("global.error.unknow_error");
  }
};
