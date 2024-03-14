export const overrideAchConfig = {
  appId: 'H41s4ysiPX57fj31',
  baseUrl: 'https://ramp.alchemypay.org',
  updateAchOrder: '/api/app/thirdPart/order/alchemy',
};

export const assetsConfig = () => {
  //TODO:
  const info = {
    isShowRampBuy: true,
    isShowRampSell: false,
  };

  return {
    isShowRamp: info.isShowRampBuy || info.isShowRampSell,
    isShowRampBuy: info.isShowRampBuy,
    isShowRampSell: info.isShowRampSell,
    overrideAchConfig,
  };
};
