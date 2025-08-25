// Layout.jsx
import React, { useRef, useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

// CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../assets/css/topbar.css';

const Topbar = ({ notifications = 0 }) => {
  const profileMenu = useRef(null);
  const settingsMenu = useRef(null);

  const profileMenuItems = useMemo(() => ([
    { label: 'Profile', icon: 'pi pi-user', command: () => console.log('Profile') },
    { label: 'Account Settings', icon: 'pi pi-cog', command: () => console.log('Account Settings') },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => console.log('Logout') }
  ]), []);

  const settingsMenuItems = useMemo(() => ([
    { label: 'Preferences', icon: 'pi pi-sliders-h', command: () => console.log('Preferences') },
    { label: 'Theme', icon: 'pi pi-palette', command: () => console.log('Theme') },
    { label: 'Language', icon: 'pi pi-globe', command: () => console.log('Language') }
  ]), []);

  return (
    <header className="topbar">
      {/* Bell */}
      <div className="p-overlay-badge">
        <Button
          icon="pi pi-bell"
          className="p-button-rounded p-button-text topbar-btn"
          aria-label="Notifications"
          onClick={() => console.log('Notifications')}
          tooltip="Notifications"
          tooltipOptions={{ position: 'bottom' }}
        />
        {notifications > 0 && <Badge value={notifications} severity="danger" />}
      </div>

      {/* Settings */}
      <span>
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-text topbar-btn"
          aria-label="Settings"
          onClick={(e) => settingsMenu.current.toggle(e)}
          tooltip="Settings"
          tooltipOptions={{ position: 'bottom' }}
        />
        <Menu model={settingsMenuItems} popup ref={settingsMenu} appendTo={document.body} />
      </span>

      {/* Profile */}
      <div className="topbar-profile" onClick={(e) => profileMenu.current.toggle(e)}>
        <Avatar icon="pi pi-user" shape="circle" className="topbar-avatar" />
        <span className="topbar-username">PiNongAllNew</span>
        <Menu model={profileMenuItems} popup ref={profileMenu} appendTo={document.body} />
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const [notifications] = useState(4);

  return (
    <div className="layout-container">
      <Topbar notifications={notifications} />
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
