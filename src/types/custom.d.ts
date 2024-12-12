import { FieldValues } from "react-hook-form";

declare module "@hookform/error-message" {
  export interface ErrorMessageProps {
    errors: FieldValues;
    name: string;
    render?: ({ message }: { message: string }) => React.ReactNode;
  }
  export const ErrorMessage: React.FC<ErrorMessageProps>;
}

declare module "next-intl/navigation" {
  export function createNavigation(config: any): {
    Link: React.ComponentType<any>;
    redirect: (url: string) => void;
    usePathname: () => string;
    useRouter: () => any;
    getPathname: (options: any) => string;
  };
}

declare module "next-intl/routing" {
  export function defineRouting(config: {
    locales: string[];
    defaultLocale: string;
  }): any;
}
