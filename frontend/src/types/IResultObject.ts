export interface IResultObject<TResponseData> {
  statusCode?: number;
  errors?: string[];
  data?: TResponseData;
}
