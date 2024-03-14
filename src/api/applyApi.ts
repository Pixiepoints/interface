import request from './axios';
import { IApplyCheckParams, IApplyConfirmParams } from './types';

export const fetchApplyCheck = async (params: IApplyCheckParams) => {
  return request.post<
    IApplyCheckParams,
    {
      domainCheck: string;
      addressCheck: string;
    }
  >('app/apply/check', params);
};

export const fetchApplyConfirm = async (params: IApplyConfirmParams) => {
  return request.post<
    IApplyConfirmParams,
    {
      transactionId: string;
    }
  >('app/apply/confirm', params);
};
