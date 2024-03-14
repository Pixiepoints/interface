import { fetchApplyConfirm } from 'api/applyApi';
import { store } from 'redux/store';
import { storages } from 'storages';
import { getTxResult } from 'utils/aelfUtils';
import { DEFAULT_ERROR } from 'utils/formattError';
import { IRowTransactionPrams, getRawTransaction } from 'utils/getRawTransaction';

export const useApply = () => {
  const getApplyRawTransaction = async (params: IRowTransactionPrams, description?: string) => {
    try {
      const rawTransaction = await getRawTransaction(params);

      const sideChain = store.getState().info.config.curChain;

      const publicKey = localStorage.getItem(storages.pubKey);
      if (rawTransaction && publicKey) {
        const { transactionId } = await fetchApplyConfirm({
          rawTransaction,
          describe: description ? encodeURIComponent(description) : null,
          publicKey,
          chainId: params.chainId,
        });
        if (!transactionId) {
          return Promise.reject(DEFAULT_ERROR);
        }
        const { TransactionId } = await getTxResult(transactionId!, params.rpcUrl, sideChain);
        if (TransactionId) {
          return true;
        } else {
          return Promise.reject(DEFAULT_ERROR);
        }
      } else {
        return Promise.reject(DEFAULT_ERROR);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { getApplyRawTransaction };
};
