import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import styles from './style.module.css';
import { Form } from 'antd';
import { Button, Input, ToolTip } from 'aelf-design';
import { ReactComponent as QuestionCircleOutlined } from 'assets/images/icons/questionCircleOutlined.svg';
import useResponsive from 'hooks/useResponsive';
import { fetchApplyCheck } from 'api/applyApi';
import { useModal } from '@ebay/nice-modal-react';
import PromptModal from 'components/PromptModal';
import { ApplyMessage } from 'constants/promptMessage';
import { useApply } from 'pageComponents/Apply/hooks/useApply';
import { StaticImageData } from 'next/image';
import ResultModal, { Status } from 'components/ResultModal';
import { useCheckLoginAndToken, useWalletService, useWalletSyncCompleted } from 'hooks/useWallet';
import { useSelector } from 'react-redux';
import { getWalletInfo } from 'redux/reducer/userInfo';
import { getConfig } from 'redux/reducer/info';
import { getRpcUrls } from 'constants/url';
import { decodeAddress, getOriginalAddress } from 'utils/addressFormatting';
import { useRouter } from 'next/navigation';

const TextArea = Input.TextArea;

interface IProps {
  className?: string;
  dappName: string;
  dappId: string;
  image?: string | StaticImageData;
}

function FormCard({ className, dappName, dappId, image }: IProps) {
  const { isMD } = useResponsive();
  const promptModal = useModal(PromptModal);
  const resultModal = useModal(ResultModal);
  const { getApplyRawTransaction } = useApply();
  const { isOK, checkLogin } = useCheckLoginAndToken();
  const { getAccountInfoSync } = useWalletSyncCompleted();
  const walletInfo = useSelector(getWalletInfo);
  const { walletType } = useWalletService();
  const config = useSelector(getConfig);
  const { domain: domainSuffix } = config;
  const router = useRouter();

  const [domain, setDomain] = useState<string>();
  const [depositAddress, setDepositAddress] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [domainError, setDomainError] = useState<string>();
  const [depositAddressError, setDepositAddressError] = useState<string>();
  const [depositAddressWarning, setDepositAddressWarning] = useState<string>();

  const disabled = useMemo(() => {
    return !!(domainError || depositAddressError || !domain || !depositAddress);
  }, [depositAddress, depositAddressError, domain, domainError]);

  const renderLabel = (title: string, toolTip?: string) => {
    return (
      <div className="flex items-center mb-[8px]">
        <span className="text-lg md:text-xl font-medium text-neutralTitle">{title}</span>
        <ToolTip title={toolTip}>
          <QuestionCircleOutlined className={clsx('w-[24px] h-[24px] ml-[8px]', styles.icon)} />
        </ToolTip>
      </div>
    );
  };

  const isValidDomain = (domain: string) => {
    const domainRegex = /^[0-9a-zA-Z-]+$/;
    return domainRegex.test(domain);
  };

  const onDomainChange = (value: string) => {
    setDomain(value);
  };

  const onDomainBlur = (value?: string) => {
    if (!value) {
      setDomainError('This field is required.');
      return false;
    }
    if (value.length > 63) {
      setDomainError('The maximum length supported is 63 characters.');
      return false;
    }
    if (!isValidDomain(value)) {
      setDomainError('Only letters (a-z), numbers (0-9), and hyphens (-) are allowed.');
      return false;
    }
    setDomain(value.toLowerCase());
    setDomainError(undefined);
    return true;
  };

  const onDepositAddressChange = (value: string) => {
    setDepositAddress(value);
  };

  const onDepositAddressBlur = (value?: string) => {
    if (!value) {
      setDepositAddressError('This field is required.');
      setDepositAddressWarning(undefined);
      return false;
    }
    const isValidAddress = decodeAddress(value);
    if (isValidAddress) {
      if (isValidAddress === 'main') {
        setDepositAddressWarning(
          'The address you entered is a MainChain address, and it has been automatically corrected to the corresponding SideChain address. Points will be sent to the SideChain address.',
        );
        setDepositAddressError(undefined);
        return true;
      }
      if (isValidAddress === 'side') {
        setDepositAddressError(undefined);
        setDepositAddressWarning(undefined);
        return true;
      }
      return false;
    } else {
      setDepositAddressError('Invalid address.');
      setDepositAddressWarning(undefined);
      return false;
    }
  };

  const onDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const showResultModal = (status: Status.ERROR | Status.SUCCESS) => {
    setLoading(false);
    const url = `${domain}${domainSuffix}`;
    resultModal.show({
      info: {
        logo: image,
        name: dappName || '',
      },
      title: status === Status.ERROR ? ApplyMessage.resultMessage.error : ApplyMessage.resultMessage.success,
      status,
      card: status === Status.SUCCESS && {
        title: url,
        description: description,
      },
      onCancel: () => {
        resultModal.hide();
        if (status === Status.SUCCESS) {
          router.push('/earn-token');
        }
      },
      hideButton: status === Status.SUCCESS,
      buttonInfo: {
        btnText: 'Try Again',
        openLoading: true,
        onConfirm: () => {
          resultModal.hide();
          onConfirm();
        },
      },
      share: {
        hidden: status === Status.ERROR ? true : false,
        title: 'Share',
        url: `https://${url}`,
      },
    });
  };

  const apply = async () => {
    try {
      const res = await getApplyRawTransaction(
        {
          walletType,
          walletInfo: walletInfo,
          contractAddress: config.sidePointsAddress,
          caContractAddress: config.sideCaAddress,
          methodName: 'ApplyToBeAdvocate',
          params: {
            domain: `${domain}${domainSuffix}`,
            dappId,
            invitee: getOriginalAddress(depositAddress),
          },
          rpcUrl: getRpcUrls()[config.curChain],
          chainId: config.curChain,
        },
        description,
      );

      promptModal.hide();
      setLoading(false);

      if (res) {
        showResultModal(Status.SUCCESS);
      }

      console.log('=====apply res', res);
    } catch (error) {
      console.log('=====apply error', error);
      promptModal.hide();
      setLoading(false);
      showResultModal(Status.ERROR);
      return Promise.reject(error);
    }
  };

  const onConfirm = async () => {
    if (isOK) {
      if (!(onDomainBlur(domain) && onDepositAddressBlur(depositAddress))) {
        return;
      }
      try {
        setLoading(true);
        const mainAddress = await getAccountInfoSync();
        if (!mainAddress) {
          setLoading(false);
          return;
        }
        if (!dappId || !domain || !depositAddress) return;
        const res = await fetchApplyCheck({
          dappName: dappId,
          domain: `${domain}${domainSuffix}`,
          address: depositAddress,
        });
        console.log('=====fetchApplyCheck', res);
        if (res.addressCheck) {
          setDepositAddressError(res.addressCheck);
          setDepositAddressWarning(res.addressCheck);
          setLoading(false);
          return;
        }
        if (res.domainCheck) {
          setDomainError(res.domainCheck);
          setLoading(false);
          return;
        }
        console.log('=====fetchApplyCheck Check');
        promptModal.show({
          info: {
            logo: image,
            name: dappName || '',
          },
          title: ApplyMessage.title,
          content: {
            title: walletInfo.portkeyInfo ? ApplyMessage.portkey.title : ApplyMessage.default.title,
            content: walletInfo.portkeyInfo ? ApplyMessage.portkey.message : ApplyMessage.default.message,
          },
          initialization: apply,
          onClose: () => {
            promptModal.hide();
            setLoading(false);
          },
        });
      } catch (error) {
        setLoading(false);
      }
    } else {
      checkLogin();
    }
  };

  return (
    <div className={clsx(className)}>
      <div className={clsx('flex', styles['form-card'])}>
        <Form layout="vertical" className="w-full">
          <Form.Item
            label={renderLabel(
              'Customised Link',
              `Your customised link for ${dappName} comprises a unique prefix, personalised by you, and a fixed suffix, ${domainSuffix}. Each account can apply for a maximum of 300 customised links.`,
            )}
            className="mb-[24px] md:mb-[40px]">
            <div>
              <Input
                placeholder="Enter a link name"
                value={domain}
                onChange={(e) => onDomainChange(e.target.value)}
                onBlur={(e) => onDomainBlur(e.target.value)}
                addonAfter={domainSuffix}
                status={domainError && 'error'}
              />
              {domainError && <span className="mt-[8px] text-xs text-functionalDanger">{domainError}</span>}
            </div>
          </Form.Item>
          <Form.Item
            label={renderLabel(
              'Wallet Address for Receiving Points',
              'All the points earned for the advocate will be sent to this address. Recommended address type: SideChain address created using Portkey.',
            )}
            className="mb-[24px] md:mb-[40px]">
            <Input
              placeholder="Enter wallet address for receiving points"
              value={depositAddress}
              onChange={(e) => onDepositAddressChange(e.target.value)}
              onBlur={(e) => onDepositAddressBlur(e.target.value)}
              status={depositAddressError ? 'error' : ''}
            />
            {(depositAddressError || depositAddressWarning) && (
              <span
                className={clsx(
                  'mt-[8px] text-xs',
                  depositAddressError && 'text-functionalDanger',
                  depositAddressWarning && 'text-functionalWarning',
                )}>
                {depositAddressError || depositAddressWarning}
              </span>
            )}
          </Form.Item>
          <Form.Item
            label={renderLabel(
              'Link Preview (Optional)',
              'When the customised link is shared, the link preview is displayed along with it. This preview enables others to quickly view key information about this link, explaning what it is and highlighting its advantages.',
            )}>
            <TextArea
              placeholder="Write an eye-catching description of your customised link to show its advantages."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="!min-h-[200px]"
              maxLength={1000}
            />
          </Form.Item>
        </Form>
      </div>
      <div
        className={clsx(
          'w-full flex justify-center items-center',
          isMD
            ? 'fixed z-10 bottom-0 left-0 py-[20px] px-[16px] bg-neutralWhiteBg border border-solid border-neutralDivider'
            : 'py-[48px]',
        )}>
        <Button
          disabled={disabled}
          type="primary"
          className={isMD ? 'w-full' : 'w-[206px]'}
          onClick={onConfirm}
          loading={loading}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default React.memo(FormCard);
