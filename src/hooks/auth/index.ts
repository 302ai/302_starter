"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
import { login } from "@/services/auth";
import { store } from "@/stores";
import { appConfigAtom } from "@/stores/slices/config_store";
import { logger } from "@/utils";
import { isAuthPath, removeParams } from "@/utils/path";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;

const attempts = new Map<string, number>();
const lockouts = new Map<string, number>();

const cleanupLockouts = () => {
  const now = Date.now();
  for (const [ip, lockoutTime] of lockouts.entries()) {
    if (now - lockoutTime >= LOCKOUT_TIME) {
      lockouts.delete(ip);
      attempts.delete(ip);
    }
  }
};

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
  const [isPending, setIsPending] = useState(false);
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
      code: "", // Default code to empty string
      remember: true, // Default remember to true
    },
    resolver: zodResolver(schema),
  });

  // Retrieve values from query param or local storage only when params change
  useEffect(() => {
    const queryCode = params.get(SHARE_CODE_URL_PARAM) || "";
    const sessionCode = store.get(appConfigAtom)?.shareCode || "";
    const storedCode = localStorage.getItem(SHARE_CODE_STORE_KEY) || "";
    const storeRemember = localStorage.getItem(SHARE_CODE_REMEMBER_KEY) || "";

    // Reset remember
    if (storeRemember === FALSE_STRING) {
      setValue("remember", false);
    }

    // Reset code
    if (queryCode || sessionCode || storedCode) {
      setValue("code", queryCode || sessionCode || storedCode);
    }
  }, [params, setValue]);

  // Function to handle authentication
  const performAuth = useCallback(
    async ({ code, remember }: AuthData) => {
      try {
        setIsPending(true);

        const clientIP = "127.0.0.1";

        const lockoutTime = lockouts.get(clientIP);
        if (lockoutTime) {
          const now = Date.now();
          if (now - lockoutTime < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lockoutTime)) / 60000);
            throw new Error(`auth.error.too_many_attempts_wait_minutes|${remainingTime}`);
          }
          lockouts.delete(clientIP);
          attempts.delete(clientIP);
        }

        cleanupLockouts();

        const result = await login(code);

        attempts.delete(clientIP);

        logger.debug("result:", JSON.stringify(result));

        setConfig((prev) => ({
          ...prev,
          apiKey: result.data?.apiKey,
          modelName: result.data?.modelName,
          isChina: result.data?.region === CHINA_REGION,
          toolInfo: result.data?.info,
          shareCode: result.data?.code,
          hideBrand: result.data?.hideBrand,
        }));

        if (remember) {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, TRUE_STRING);
          localStorage.setItem(SHARE_CODE_STORE_KEY, code);
        } else {
          localStorage.setItem(SHARE_CODE_REMEMBER_KEY, FALSE_STRING);
          sessionStorage.setItem(SHARE_CODE_STORE_KEY, code);
          localStorage.setItem(SHARE_CODE_STORE_KEY, "");
        }

        if (isAuthPath(pathname)) {
          replace("/");
        } else {
          removeParams(pathname);
        }
      } catch (error: unknown) {
        replace(env.NEXT_PUBLIC_AUTH_PATH);

        const clientIP = "127.0.0.1";
        const currentAttempts = (attempts.get(clientIP) || 0) + 1;
        attempts.set(clientIP, currentAttempts);

        if (currentAttempts >= MAX_ATTEMPTS) {
          lockouts.set(clientIP, Date.now());
          setError("code", {
            type: "server",
            message: t("auth.error.too_many_attempts"),
          });
        } else if (error instanceof Error) {
          setError("code", {
            type: "server",
            message: t(error.message),
          });
        }
      } finally {
        setIsPending(false);
      }
    },
    [t, setError, pathname, replace, setConfig]
  );

  // Callback for form submission
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
    isPending,
    setValue,
    onAuth,
    watch,
    register,
    errors,
  };
};

export default useAuth;
