import React, { ReactNode, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import DappInfoCard, { IDappInfoCard } from 'components/DappInfoCard';
import { useResponsive } from 'hooks/useResponsive';
import { Button } from 'aelf-design';
import { ReactComponent as SuccessIcon } from 'assets/images/icons/success.svg';
import { ReactComponent as FailedIcon } from 'assets/images/icons/failed.svg';
import ShareList from 'components/ShareList';
import RichText from 'components/RichText';

export enum Status {
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  INFO = 'info',
}

interface IProps {
  modalTitle?: string;
  title?: string;
  description?: string | ReactNode | string[];
  status?: Status;
  hideButton?: boolean;
  buttonInfo?: {
    btnText?: string;
    openLoading?: boolean;
    onConfirm?: <T, R>(params?: T) => R | void | Promise<void>;
  };
  info: IDappInfoCard;
  card?: {
    title?: string | ReactNode;
    description?: string | ReactNode | string[];
  };
  share: {
    hidden?: boolean;
    title?: string;
    list?: [];
    url?: string;
  };
  onCancel?: <T, R>(params?: T) => R | void;
}

function ResultModal({
  modalTitle,
  title,
  description,
  status = Status.INFO,
  buttonInfo,
  hideButton = false,
  info,
  card,
  share,
  onCancel,
}: IProps) {
  const modal = useModal();
  const { isMD } = useResponsive();

  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    if (buttonInfo?.onConfirm) {
      if (buttonInfo.openLoading) {
        setLoading(true);
      }
      await buttonInfo.onConfirm();
      setLoading(false);
      return;
    }
    modal.hide();
    return;
  };

  const Icon = useMemo(() => {
    return {
      [Status.ERROR]: <FailedIcon className="w-[32px] h-[32px]" />,
      [Status.SUCCESS]: <SuccessIcon className="w-[32px] h-[32px]" />,
      [Status.WARNING]: '',
      [Status.INFO]: '',
    }[status];
  }, [status]);

  const footerPc = hideButton ? null : (
    <div className="w-full flex flex-col items-center">
      {!hideButton ? (
        <Button
          type="primary"
          size="ultra"
          loading={loading}
          className={`${isMD ? 'w-full' : '!w-[256px]'}`}
          onClick={onClick}>
          {buttonInfo?.btnText || 'View'}
        </Button>
      ) : null}
    </div>
  );

  const footerMobile = hideButton ? null : (
    <div className="w-full flex flex-col items-center">
      <Button
        type="primary"
        size="ultra"
        loading={loading}
        className={`${isMD ? 'w-full' : '!w-[256px]'}`}
        onClick={onClick}>
        {buttonInfo?.btnText || 'View'}
      </Button>
    </div>
  );

  const getDescriptionCom = (description: string | ReactNode | string[]) => {
    if (typeof description === 'string') {
      return <RichText text={description} />;
    } else if (description instanceof Array) {
      return description.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    } else {
      return description;
    }
  };

  return (
    <Modal
      title={modalTitle || ''}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={onCancel || modal.hide}
      afterClose={modal.remove}
      footer={isMD ? footerMobile : footerPc}>
      <div className="w-full h-full flex flex-col">
        {info ? <DappInfoCard {...info} layout="vertical" /> : null}
        {title || description ? (
          <div className="flex flex-col items-center mb-[24px] md:mb-[32px] mt-[24px] md:mt-[48px]">
            <p className="flex flex-col md:flex-row items-center justify-center">
              <span className="mb-[16px] md:mr-[16px] md:mb-0">{Icon}</span>
              <span className="text-neutralTitle font-semibold text-xl md:text-2xl text-center">{title}</span>
            </p>
            <p className="text-base font-medium text-neutralSecondary mt-4 text-center">
              {getDescriptionCom(description)}
            </p>
          </div>
        ) : null}

        {card && (
          <div className="flex flex-col h-max w-full border border-solid border-neutralBorder rounded-lg p-[16px] md:p-[32px]">
            <span className="text-brandDefault font-semibold text-base md:text-xl text-center">{card.title}</span>
            {card.description ? (
              <p className="text-base font-medium text-neutralSecondary mt-[8px] text-center">
                {getDescriptionCom(card.description)}
              </p>
            ) : null}
          </div>
        )}
        {share && !share.hidden ? (
          <div className="flex flex-col justify-center items-center px-[24px] md:px-[100px] mt-[60px] mb-[32px] md:mt-[48px]">
            {share.title ? (
              <span className="text-xl md:text-2xl font-semibold text-neutralTitle mb-[24px] md:mb-[32px]">
                {share.title}
              </span>
            ) : null}
            <div className="w-full">
              <ShareList shareUrl={share.url} />
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export default NiceModal.create(ResultModal);
