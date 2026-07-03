import { Expert } from "../../types";

export interface expertDao {
  getAllExperts(): Promise<Expert[]>;
}

export * from "./postgresExpertDao";
