import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'aelf-design';
import { Space, Drawer } from 'antd';
import { DropMenuMy } from './DropMenuMy';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as MenuIcon } from 'assets/images/menu.svg';
import { ReactComponent as LogoIcon } from 'assets/images/logo.svg';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function Header() {
  const pathName = usePathname();
  const { isMD } = useResponsive();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  return (
    <header className=" sticky top-0 left-0 z-50 flex items-center justify-between w-full px-4 py-4 md:px-10 bg-neutralWhiteBg">
      <Link href="/">
        <LogoIcon width={isMD ? 110 : 175} height={isMD ? 20 : 32} />
      </Link>

      <Space className="gap-4 md:gap-16">
        {!isMD ? (
          <>
            <Link href="/" className={`${pathName === '/' ? 'text-brandDefault' : 'text-neutralTitle'}`}>
              <div className="font-medium text-lg hover:text-brandHover">dApps</div>
            </Link>

            <Link
              href="/apply/Schrödinger"
              className={`${pathName.startsWith('/apply') ? 'text-brandDefault' : 'text-neutralTitle'}`}>
              <div className="font-medium text-lg hover:text-brandHover">Apply</div>
            </Link>

            <Link href="/ranking" className={`${pathName === '/ranking' ? 'text-brandDefault' : 'text-neutralTitle'}`}>
              <div className="font-medium text-lg hover:text-brandHover">Leaderboard</div>
            </Link>
          </>
        ) : null}
        <DropMenuMy isMobile={isMD} />
        {isMD ? (
          <Button
            type="link"
            icon={<MenuIcon className="w-8 h-8" width={32} height={32} />}
            onClick={() => setShowDrawer(true)}
          />
        ) : null}
        <Drawer
          placement="right"
          mask={false}
          open={showDrawer}
          closeIcon={null}
          classNames={{
            body: '!p-0',
            header: '!px-4 !py-5 !border-none',
          }}
          title={
            <header className="flex justify-between items-center">
              <span className="font-semibold text-xl text-neutralTitle">Menu</span>
              <CloseOutlined className="-m-4 p-4" width={16} height={16} onClick={() => setShowDrawer(false)} />
            </header>
          }
          width={'100%'}
          onClose={() => setShowDrawer(false)}>
          <div onClick={() => setShowDrawer(false)}>
            <Link href="/">
              <div
                className={`${
                  pathName === '/' ? 'bg-neutralHoverBg' : ''
                } font-medium text-sm px-4 py-3 text-neutralTitle`}>
                dApps
              </div>
            </Link>

            <Link href="/apply/Schrödinger">
              <div
                className={`${
                  pathName.startsWith('/apply') ? 'bg-neutralHoverBg' : ''
                } font-medium text-sm px-4 py-3 text-neutralTitle`}>
                Apply
              </div>
            </Link>

            <Link href="/ranking">
              <div
                className={`${
                  pathName === '/ranking' ? 'bg-neutralHoverBg' : ''
                } font-medium text-sm px-4 py-3 text-neutralTitle`}>
                Leaderboard
              </div>
            </Link>
          </div>
        </Drawer>
      </Space>
    </header>
  );
}
