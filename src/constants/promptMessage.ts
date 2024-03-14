export const transactionPending = 'Pending transaction confirmation';
export const confirmationAuto = 'Please wait for auto confirmation.';

export const ApplyMessage = {
  title: 'Approve Application',
  portkey: {
    title: transactionPending,
    message: confirmationAuto,
  },
  default: {
    title: transactionPending,
    message: 'Please confirm the application in the wallet.',
  },
  resultMessage: {
    error: 'Customised Link Registration Failed',
    success: 'Customised Link Registered',
  },
};
