import Title from './components/Title';
import useResponsive from 'hooks/useResponsive';

import clsx from 'clsx';
import styles from './style.module.css';
import FormCard from './components/FormCard';
import { useParams, useRouter } from 'next/navigation';
import { ReactComponent as ArrowRightSVG } from 'assets/images/arrow-right.svg';
import useGetDappList from 'hooks/useGetDappList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommonSelect from 'components/CommonSelect';
import { Col, Flex, Row } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import Modal from 'components/Modal';
import { Button } from 'aelf-design';

function Apply() {
  const { isMD } = useResponsive();
  const [selectedDappId, setSelectedDappId] = useState('');
  const { dappName: dappNameFormParams } = useParams() as {
    dappName: string;
  };
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const dappList = useGetDappList({ dappName: '' });

  const dappName = useMemo(() => {
    return dappNameFormParams ? decodeURIComponent(dappNameFormParams) : '';
  }, [dappNameFormParams]);

  const dappInfo = useMemo(() => {
    return dappList?.find((item) => item?.dappName === dappName) || dappList?.[0];
  }, [dappList, dappName]);

  const renderDappListOptions = useMemo(() => {
    return dappList?.map((item) => ({
      value: item.dappId,
      label: (
        <Row gutter={[24, 0]} align="middle">
          <Col className="hidden md:block">
            <SkeletonImage img={item.icon} className="w-[40px] h-[40px]" />
          </Col>
          <Col className="text-base text-neutralPrimary font-medium">{item.dappName}</Col>
        </Row>
      ),
    }));
  }, [dappList]);

  const onChange = useCallback(
    (value: string) => {
      const dappName = dappList?.find((item) => item.dappId === value)?.dappName || '';
      router.replace(dappName ? `/apply/${dappName}` : '/apply');
    },
    [dappList, router],
  );

  useEffect(() => {
    setSelectedDappId(dappInfo?.dappId || dappList?.[0]?.dappId || '');
  }, [dappInfo?.dappId, dappList, selectedDappId]);

  return (
    <div className={clsx(isMD ? styles['mobile-apply'] : styles.apply)}>
      {dappInfo && (
        <>
          <Title title="Apply to Be a dApp Advocate" />
          <Flex align="center" justify="space-between" wrap="wrap" gap={16} className="mt-10">
            <div className="min-w-[280px] flex-1">
              <CommonSelect
                subfix="dApp"
                selectClassName="!rounded-lg !flex-shrink-0"
                options={renderDappListOptions}
                onChange={onChange}
                value={selectedDappId}
              />
            </div>
            <Flex
              align="center"
              className="w-fit cursor-pointer"
              gap={8}
              onClick={() => {
                setModalVisible(true);
              }}>
              <span className="text-base font-medium text-brandDefault">Application Rules</span>
              <ArrowRightSVG />
            </Flex>
          </Flex>
          <FormCard
            className="md:mt-[40px] mt-[24px]"
            dappName={decodeURIComponent(dappName)}
            dappId={dappInfo.dappId}
            image={dappInfo.icon}
            suffix={dappInfo.firstLevelDomain}
          />
        </>
      )}
      <Modal
        title="Application Rules"
        open={modalVisible}
        closable={false}
        footer={
          <Button
            type="primary"
            className="w-[206px]"
            onClick={() => {
              setModalVisible(false);
            }}>
            Got it
          </Button>
        }
        onCancel={() => {
          setModalVisible(false);
        }}>
        <div className="p-6 text-base font-normal text-neutralPrimary rounded-lg bg-neutralHoverBg">
          {dappInfo?.pointsRule?.length > 1 ? (
            <ul className={clsx('flex flex-col gap-4 list-none', styles.ruleList)}>
              {dappInfo?.pointsRule?.map((text, index) => {
                return (
                  <li key={index}>
                    <p>{text}</p>
                  </li>
                );
              })}
            </ul>
          ) : dappInfo?.pointsRule?.length === 1 ? (
            <p>{dappInfo?.pointsRule?.[0]}</p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

export default Apply;
