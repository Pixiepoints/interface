import Loading from 'components/Loading';
import { Modal } from 'antd';
import styles from './style.module.css';

export default function PageLoading() {
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
