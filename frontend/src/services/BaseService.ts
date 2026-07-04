import { IResultObject } from "@/src/types";
import axios, { AxiosError, AxiosInstance } from "axios";

export abstract class BaseService {
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:3000/api",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  protected handleAxiosError<T>(error: unknown): IResultObject<T> {
    const axiosError = error as AxiosError<{ error: string }>;
    return {
      statusCode: axiosError.response?.status,
      errors: [
        axiosError.response?.data.error ?? axiosError.message ?? "UnknownError",
      ],
    };
  }
}
