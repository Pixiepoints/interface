import { Button } from 'aelf-design';
import { DropMenuBase, IMenuItem } from 'components/DropMenuBase';
import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MenuProps } from 'antd';
import clsx from 'clsx';
import myIcon, { ReactComponent as MyIconComp } from 'assets/images/icon-my.svg';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { WalletType } from 'aelf-web-login';
import { useGetToken } from 'hooks/useGetToken';

interface IDropMenuMy {
  isMobile: boolean;
}

const MenuItems = [
  {
    label: 'My Points',
    href: '/earn-token',
  },
  {
    label: 'Log Out',
    href: '',
  },
];

export function DropMenuMy({ isMobile }: IDropMenuMy) {
  const [showDropMenu, setShowDropMenu] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const { isLogin, logout, login, wallet, walletType } = useWalletService();
  const { checkLogin } = useCheckLoginAndToken();
  const { checkTokenValid } = useGetToken();

  const onClickHandler = useCallback(
    (ele: IMenuItem) => {
      setShowDropMenu(false);
      if (ele.label === 'Log Out') {
        logout();
        return;
      }

      if (ele.href) {
        if (ele.href === '/earn-token') {
          if (checkTokenValid()) {
            router.push(ele.href);
          } else {
            checkLogin();
          }
          return;
        }
        router.push(ele.href);
        return;
      }
    },
    [checkLogin, checkTokenValid, logout, router],
  );

  const items: MenuProps['items'] = useMemo(() => {
    const tempItems = [...MenuItems];
    if (walletType === WalletType.portkey) {
      tempItems.unshift({
        label: 'My Asset',
        href: '/assets',
      });
    }
    return tempItems.map((ele, idx) => ({
      label: (
        <div
          key={idx}
          className={clsx('block px-1 text-base font-medium', pathName === ele.href && '!text-primary-color')}
          onClick={() => {
            onClickHandler(ele);
          }}>
          {ele.label}
        </div>
      ),
      key: idx + '',
    }));
  }, [walletType, pathName, onClickHandler]);

  const itemsForPhone = useMemo(() => {
    const tempItems = [...MenuItems];
    if (walletType === WalletType.portkey) {
      tempItems.unshift({
        label: 'My Asset',
        href: '/assets',
      });
    }
    return tempItems.map((ele, idx) => (
      <div
        key={idx}
        className="font-medium text-sm px-4 py-3 text-neutralTitle cursor-pointer"
        onClick={() => {
          onClickHandler(ele);
        }}>
        {ele.label}
      </div>
    ));
  }, [walletType, onClickHandler]);

  const MyIcon = useMemo(
    () => (
      <Button
        type="primary"
        ghost
        size={isMobile ? 'small' : 'large'}
        onClick={() => setShowDropMenu(true)}
        icon={<MyIconComp className="w-5 h-5 fill-brandDefault" width={20} height={20} />}>
        My
      </Button>
    ),
    [isMobile],
  );

  if (!isLogin) {
    return (
      <Button type="primary" size={isMobile ? 'small' : 'large'} onClick={login}>
        Log in
      </Button>
    );
  }

  return (
    <DropMenuBase
      showDropMenu={showDropMenu}
      isMobile={isMobile}
      items={items}
      itemsForPhone={itemsForPhone}
      targetNode={MyIcon}
      onCloseHandler={() => setShowDropMenu(false)}
      titleTxt="My"
      titleIcon={myIcon}></DropMenuBase>
  );
}
