import Title from './components/Title';
import Details from './components/Details';
import useResponsive from 'hooks/useResponsive';

import clsx from 'clsx';
import styles from './style.module.css';
import FormCard from './components/FormCard';
import { useParams } from 'next/navigation';
import { useGetDappInfo } from './hooks/useGetDappInfo';
import { useSelector } from 'redux/store';
import { getConfig } from 'redux/reducer/info';

function Apply() {
  const { isMD } = useResponsive();
  const { dappName } = useParams() as {
    dappName: string;
  };
  const { dappInfo } = useGetDappInfo(decodeURIComponent(dappName));
  const config = useSelector(getConfig);

  return (
    <div className={clsx(isMD ? styles['mobile-apply'] : styles.apply)}>
      {dappInfo && (
        <>
          <Title title="Apply to Be a dApp Advocate" />
          <Details
            className="md:mt-[40px] mt-[24px]"
            image={dappInfo.icon}
            name={decodeURIComponent(dappName)}
            introduction={config.applyInstructions}
          />
          <FormCard
            className="md:mt-[40px] mt-[24px]"
            dappName={decodeURIComponent(dappName)}
            dappId={dappInfo.dappId}
            image={dappInfo.icon}
          />
        </>
      )}
    </div>
  );
}

export default Apply;
