import { useSelector } from 'react-redux';
import { selectInfo } from 'redux/reducer/info';

const useGetStoreInfo = () => {
  const info = useSelector(selectInfo);
  return {
    hasToken: info.hasToken,
    cmsInfo: info.config,
  };
};

export default useGetStoreInfo;
