"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  CHINA_REGION,
  FALSE_STRING,
  SHARE_CODE_REMEMBER_KEY,
  SHARE_CODE_STORE_KEY,
  SHARE_CODE_URL_PARAM,
  TRUE_STRING,
} from "@/constants";
import { env } from "@/env";
import { useRouter } from "@/i18n/routing";
import { store } from "@/stores";
import { appConfigAtom } from "@/stores/slices/config_store";
import { logger } from "@/utils";
import { isAuthPath, removeParams } from "@/utils/path";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

// Define the schema using Zod for form validation
const schema = z.object({
  code: z.string().optional(),
  remember: z.boolean().optional(),
});

// Define the type for authentication data
type AuthData = {
  code: string;
  remember: boolean;
};

const useAuth = () => {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const setConfig = useSetAtom(appConfigAtom);

  // Initialize form handling with react-hook-form and Zod resolver
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AuthData>({
    defaultValues: {
      code: "",
      remember: true,
    },
    resolver: zodResolver(schema),
  });

  // Retrieve values from query param or local storage only when params change
  useEffect(() => {
    const queryCode = params.get(SHARE_CODE_URL_PARAM) || "";
    const sessionCode = store.get(appConfigAtom)?.shareCode || "";
    const storedCode = localStorage.getItem(SHARE_CODE_STORE_KEY) || "";
    const storeRemember = localStorage.getItem(SHARE_CODE_REMEMBER_KEY) || "";

    if (storeRemember === FALSE_STRING) {
      setValue("remember", false);
    }

    if (queryCode || sessionCode || storedCode) {
      setValue("code", queryCode || sessionCode || storedCode);
    }
  }, [params, setValue]);

  // Update app configuration when session changes
  useEffect(() => {
    if (session?.user) {
      setConfig((prev) => ({
        ...prev,
        apiKey: session.user.apiKey,
        modelName: session.user.modelName,
        isChina: session.user.region === CHINA_REGION,
        toolInfo: session.user.info,
        shareCode:
          session.user.authType === "share_code" ? session.user.id : "",
        hideBrand: session.user.hideBrand,
      }));
    }
  }, [session, setConfig]);

  const performAuth = useCallback(
    async ({ code, remember }: AuthData) => {
      try {
        const hostname =
          env.NEXT_PUBLIC_DEV_HOST_NAME || window.location.host.split(".")[0];

        // Try API Key authentication first if available
        if (env.API_KEY) {
          const result = await signIn("apikey", {
            apiKey: env.API_KEY,
            redirect: false,
          });

          if (result?.error) {
            throw new Error(result.error);
          }
        } else {
          // Try share code authentication
          const result = await signIn("sharecode", {
            hostname,
            pwd: code,
            redirect: false,
          });

          if (result?.error) {
            throw new Error(result.error);
          }
        }

        // Store or remove auth code based on remember flag
        if (remember) {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, TRUE_STRING);
          localStorage.setItem(SHARE_CODE_STORE_KEY, code);
        } else {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, FALSE_STRING);
          sessionStorage.setItem(SHARE_CODE_STORE_KEY, code);
          localStorage.setItem(SHARE_CODE_STORE_KEY, "");
        }

        // Redirect to home if on auth page
        if (isAuthPath(pathname)) {
          replace("/");
        } else {
          removeParams(pathname);
        }
      } catch (error) {
        logger.error("Authentication error:", error);
        replace(env.NEXT_PUBLIC_AUTH_PATH);
        if (error instanceof Error) {
          setError("code", {
            type: "server",
            message: t(error.message),
          });
        }
      }
    },
    [t, setError, pathname, replace]
  );

  const onSubmit = useCallback(
    async (data: AuthData) => {
      await performAuth(data);
    },
    [performAuth]
  );

  const onAuth = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return {
    isPending: status === "loading",
    setValue,
    onAuth,
    watch,
    register,
    errors,
  };
};

export default useAuth;
