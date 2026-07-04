import { IResultObject } from "../types";
import { BaseService } from "./BaseService";

export abstract class EntityService<TEntity> extends BaseService {
  constructor(private basePath: string) {
    super();
  }

  async getAllAsync(): Promise<IResultObject<TEntity[]>> {
    try {
      const response = await this.axiosInstance.get<TEntity[]>(this.basePath);

      return { data: response.data, statusCode: response.status };
    } catch (error) {
      return this.handleAxiosError<TEntity[]>(error);
    }
  }
}
