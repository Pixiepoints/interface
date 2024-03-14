import AElf from 'aelf-sdk';
import { store } from 'redux/store';
import { SupportedELFChainId } from 'types';
const { decodeAddressRep } = AElf.utils;

export const getOriginalAddress = (address: string) => {
  if (!address) return '';
  return address.replace(/^ELF_/, '').replace(/_.*$/, '');
};

export const addPrefixSuffix = (str: string, ChainId?: string) => {
  const sideChain = store.getState().info.config.curChain;
  if (!str) return str;
  let resStr = str;
  const prefix = 'ELF_';
  const suffix = `_${ChainId || sideChain}`;
  if (!str.startsWith(prefix)) {
    resStr = `${prefix}${resStr}`;
  }
  if (!str.endsWith(suffix)) {
    resStr = `${resStr}${suffix}`;
  }
  return resStr;
};

export const decodeAddress = (address: string) => {
  try {
    const config = store.getState().info.config;
    if (!address) return false;
    if (address.indexOf('_') > -1) {
      const parts = address.split('_');
      if (parts[0] === 'ELF' && parts[2]) {
        decodeAddressRep(parts[1]);
        if (parts[2] === config.curChain) {
          return 'side';
        } else if (parts[2] === SupportedELFChainId.MAIN_NET) {
          return 'main';
        }
      } else {
        return false;
      }
    } else {
      decodeAddressRep(address);
      return false;
    }
  } catch (error) {
    return false;
  }
};

export enum OmittedType {
  ADDRESS = 'address',
  NAME = 'name',
  CUSTOM = 'custom',
}

export const getOmittedStr = (
  str: string,
  type: OmittedType,
  params?: {
    prevLen: number;
    endLen: number;
    limitLen: number;
  },
) => {
  const defaults: Record<OmittedType, { prevLen: number; endLen: number; limitLen: number }> = {
    [OmittedType.ADDRESS]: { prevLen: 10, endLen: 9, limitLen: 19 },
    [OmittedType.NAME]: { prevLen: 6, endLen: 4, limitLen: 10 },
    [OmittedType.CUSTOM]: { prevLen: 9, endLen: 9, limitLen: 10 },
  };

  const { prevLen, endLen, limitLen } = type === OmittedType.CUSTOM ? params || defaults[type] : defaults[type];

  if (str.length > limitLen) {
    return `${str.slice(0, prevLen)}...${str.slice(-endLen)}`;
  }
  return str;
};
