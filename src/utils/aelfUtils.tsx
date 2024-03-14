import AElf from 'aelf-sdk';
import { sleep } from './common';

const httpProviders: any = {};
export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

export async function getTxResult(
  TransactionId: string,
  rpcUrl: string,
  chainId: Chain,
  reGetCount = 0,
  retryCountWhenNotExist = 0,
): Promise<any> {
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    throw Error('Failed to retrieve transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'notexisted') {
    if (retryCountWhenNotExist > 5) {
      throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
    }
    await sleep(1000);
    retryCountWhenNotExist++;
    return getTxResult(TransactionId, rpcUrl, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    // || txResult.Status.toLowerCase() === 'notexisted'
    if (reGetCount > 10) {
      throw Error(`Timeout. Transaction ID:${TransactionId}`);
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, rpcUrl, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }

  throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
}
