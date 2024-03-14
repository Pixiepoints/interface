import request from './axios';

export const fetchDAppList = async (params: IDAppListParams): Promise<IDappListData[]> => {
  return request.post<IDAppListParams, IDappListData[]>('app/dapps', params);
};
