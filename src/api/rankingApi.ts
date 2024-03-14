import request from './axios';

export const fetchRankingList = async (params: IRankingParams): Promise<IRankingRes> => {
  return request.post<IRankingParams, IRankingRes>('app/points/ranking', params);
};

export const fetchRankingDetail = async (params: IRankingDetailParams) => {
  return request.post<IRankingDetailParams, IRankingDetail>('app/points/ranking/detail', params);
};

export const fetchEarnTokenList = async (params: IEarnListParams) => {
  return request.post<IEarnListParams, IEarnListResults>('app/points/earned/list', params);
};
