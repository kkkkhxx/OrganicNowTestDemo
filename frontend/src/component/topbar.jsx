import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { profileMenuItems, settingsMenuItems } from "./menuitem";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../assets/css/topbar.css";

export default function Topbar({ notifications = 0, title = "", icon = "" }) {
  const profileMenu = useRef(null);
  const settingsMenu = useRef(null);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: Icon + Title */}
        <div className="topbar-left">
          {icon && <i className={`topbar-icon ${icon}`} />}
          <h2 className="topbar-title">{title}</h2>
        </div>

        {/* Right: Bell + Cog + Profile */}
        <div className="topbar-right">
          <div className="p-overlay-badge">
            <Button
              icon="pi pi-bell"
              className="p-button-rounded p-button-text topbar-btn"
              aria-label="Notifications"
              tooltip="Notifications"
              tooltipOptions={{ position: "bottom" }}
              onClick={() => console.log("Notifications clicked")}
            />
            {notifications > 0 && <Badge value={notifications} severity="danger" />}
          </div>

          <span>
            <Button
              icon="pi pi-cog"
              className="p-button-rounded p-button-text topbar-btn"
              aria-label="Settings"
              onClick={(e) => settingsMenu.current.toggle(e)}
              tooltip="Settings"
              tooltipOptions={{ position: "bottom" }}
            />
            <Menu model={settingsMenuItems} popup ref={settingsMenu} appendTo={document.body} />
          </span>

          <div
            className="topbar-profile"
            onClick={(e) => profileMenu.current.toggle(e)}
          >
            <Avatar icon="pi pi-user" shape="circle" className="topbar-avatar" />
            <span className="topbar-username">PiNongAllNew</span>
            <Menu model={profileMenuItems} popup ref={profileMenu} appendTo={document.body} />
          </div>
        </div>
      </div>
    </header>
  );
}
