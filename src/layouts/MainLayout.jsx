import React, { useRef, useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

// CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
    <header
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        left: 'auto',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      {/* Bell */}
      <div className="p-overlay-badge">
        <Button
          icon="pi pi-bell"
          className="p-button-rounded p-button-text"
          aria-label="Notifications"
          onClick={() => console.log('Notifications')}
          tooltip="Notifications"
          tooltipOptions={{ position: 'bottom' }}
          style={{ width: '2.5rem', height: '2.5rem', color: '#0084F7' }}
        />
        {notifications > 0 && <Badge value={notifications} severity="danger" />}
      </div>

      {/* Settings */}
      <span>
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-text"
          aria-label="Settings"
          onClick={(e) => settingsMenu.current.toggle(e)}
          tooltip="Settings"
          tooltipOptions={{ position: 'bottom' }}
          style={{ width: '2.5rem', height: '2.5rem', color: '#0084F7' }}
        />
        <Menu model={settingsMenuItems} popup ref={settingsMenu} appendTo={document.body} />
      </span>

      {/* Profile */}
      <div
        onClick={(e) => profileMenu.current.toggle(e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: '#57B1FF',
          borderRadius: '9999px',
          padding: '0.3rem 0.8rem 0.3rem 0.3rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Avatar
          icon="pi pi-user"
          shape="circle"
          style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: '#0084F7',
            color: '#fff'
          }}
        />
        <span style={{ color: '#fff', fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          PiNongAllNew
        </span>
        <Menu model={profileMenuItems} popup ref={profileMenu} appendTo={document.body} />
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const [notifications] = useState(3);

  return (
    <div
      style={{
        backgroundColor: '#E3F2FD',
        minHeight: '100vh',
        width: '100%',
        margin: 0
      }}
    >
      <Topbar notifications={notifications} />
    
      <main style={{ paddingTop: 80 }}>{children}</main>
    </div>
  );
};

export default Layout;
