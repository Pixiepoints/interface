import { Dropdown } from 'aelf-design';
import { MenuProps, Drawer } from 'antd';
import { ReactNode } from 'react';
import { CloseOutlined } from '@ant-design/icons';

export interface IMenuItem {
  label: string;
  href?: string;
  hash?: string;
}
interface IDropMenu {
  isMobile: boolean;
  showDropMenu: boolean;
  items: MenuProps['items'];
  itemsForPhone: ReactNode;
  targetNode: ReactNode;
  onCloseHandler: () => void;
  titleTxt: string;
  titleIcon: string;
}
const DropMenuBase = ({
  isMobile,
  showDropMenu,
  items,
  itemsForPhone,
  targetNode,
  onCloseHandler,
  titleTxt,
  titleIcon,
}: IDropMenu) => {
  const filterClickHandler: MenuProps['onClick'] = (obj) => {
    console.log(obj.key);
  };

  return isMobile ? (
    <>
      {targetNode}
      <Drawer
        classNames={{
          header: '!px-4 !py-5 !border-none',
          body: '!p-0',
        }}
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-neutralTitle">{titleTxt}</span>
            <CloseOutlined className="-m-4 p-4" width={16} height={16} onClick={onCloseHandler} />
          </div>
        }
        closeIcon={null}
        open={showDropMenu}
        placement="right"
        width={'100%'}
        onClose={onCloseHandler}
        maskClosable>
        {itemsForPhone}
      </Drawer>
    </>
  ) : (
    <Dropdown menu={{ items, onClick: filterClickHandler, selectable: false }}>{targetNode}</Dropdown>
  );
};

export { DropMenuBase };
