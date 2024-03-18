import Loading from 'components/Loading';
import { Modal } from 'antd';
import styles from './style.module.css';
import { useMount } from 'ahooks';
import { useState } from 'react';

export default function PageLoading() {
  const [isClient, setIsClient] = useState<boolean>(false);
  useMount(() => {
    setIsClient(true); // the comp perhaps run in server environment
  });
  if (!isClient) return null;
  return (
    <Modal
      className={styles.loading}
      centered={true}
      open={true}
      mask={false}
      footer={null}
      closable={false}
      closeIcon={null}>
      <Loading />
    </Modal>
  );
}
