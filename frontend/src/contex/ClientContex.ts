import { createContext } from "react";
import { IClient } from "../types";

export interface IClientState {
  clientInfo?: IClient;
  setClientInfo?: (value: IClient | undefined) => void;
}

export const ClientContex = createContext<IClientState>({});
