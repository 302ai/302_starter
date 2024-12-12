export interface AuthUser {
  id: string;
  name: string;
  apiKey: string;
  modelName: string;
  region: number;
  settings: Record<string, unknown>;
  info: string;
  hideBrand: boolean;
  status: number;
  authType: "apiKey" | "freeTool" | "shareCode";
  extraData?: Record<string, unknown>;
}

export interface AuthData {
  apiKey: string;
  createdBy?: string;
  modelName: string;
  region: number;
  settings: Record<string, unknown>;
  info: string;
  status: number;
  extraData?: Record<string, unknown>;
}

export interface AuthResponse {
  code: number;
  msg: string;
  data: AuthData | Record<string, never>;
}
