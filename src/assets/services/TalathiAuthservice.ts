import api from "./api";

export interface TalathiUserInfo {
  distCode: string;
  districtName: string;
  talcode: string;
  talukaName: string;
  vlgCode: string;
  village: string;
  lgdCode: string;
  sevarth_id: string;
  sevarthName: string;
  [key: string]: unknown;
}

interface TalathiLoginApiResponse {
  token: string;
  userInfo: TalathiUserInfo;
}

export interface TalathiAuthResponse {
  isSuccess?: boolean;
  data: TalathiLoginApiResponse;
  message?: string;
}
export class TalathiAuthError extends Error {
  readonly code:
    | "TOKEN_MISSING"
    | "INVALID_RESPONSE"
    | "SESSION_EXPIRED"
    | "SERVER_ERROR";

  constructor(
    code:
      | "TOKEN_MISSING"
      | "INVALID_RESPONSE"
      | "SESSION_EXPIRED"
      | "SERVER_ERROR",
    message: string
  ) {
    super(message);

    this.name = "TalathiAuthError";
    this.code = code;
  }
}


export const getTalathiUser = async (
  ferfarToken: string
): Promise<TalathiLoginApiResponse> => {
  if (!ferfarToken?.trim()) {
    throw new TalathiAuthError(
      "TOKEN_MISSING",
      "Authentication token not found. Please return to the e-Ferfar Portal and access this application again."
    );
  }

  try {
    const response = await api.get<TalathiAuthResponse>(
      "/api/TalathiUsers/login",
      {
        params: {
          Eferfar: ferfarToken,
        },
        skipAuth: true,
      }
    );

    const result = response.data;

    if (
      
      !result.token ||
      !result.userInfo
    ) {
      throw new TalathiAuthError(
        "INVALID_RESPONSE",
        "Unable to validate your session."
      );
    }

    return result;
  } catch (error: any) {
    if (error instanceof TalathiAuthError) {
      throw error;
    }

    if (error?.response?.status === 401) {
      throw new TalathiAuthError(
        "SESSION_EXPIRED",
        "Your authenticated session has expired."
      );
    }

    throw new TalathiAuthError(
      "SERVER_ERROR",
      error?.response?.data?.message ??
        "Unable to connect to the authentication server."
    );
  }
};