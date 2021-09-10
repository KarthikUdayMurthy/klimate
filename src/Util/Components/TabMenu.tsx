import * as React from 'react';

export interface ITabMenuItem {
  text: string;
  onClick: () => void;
  isSelected: boolean;
  icon?: string;
}

interface TabMenuProps {
  menuItems: ITabMenuItem[];
}

const TabMenu: React.FC<TabMenuProps> = ({ menuItems }) => {
  return (
    <div className="tabMenuWrap card">
      {menuItems.map(menuItem => (
        <button
          key={menuItem.text}
          className={
            menuItem.isSelected ? 'iBtnPrimary active' : 'iBtnSecondary'
          }
          onClick={menuItem.onClick}
        >
          {menuItem.icon && <i className={menuItem.icon + ' fontM'} />}
          {menuItem.icon && String.fromCharCode(160)}
          {menuItem.text}
        </button>
      ))}
    </div>
  );
};

export { TabMenu };
