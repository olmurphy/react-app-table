import React, { useContext, createContext, useState, useMemo } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import "./Sidebar.css"; // Import the CSS file

const SidebarContext = createContext({ expanded: true });

type SideBarProps = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: Readonly<SideBarProps>) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-header">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`sidebar-logo ${expanded ? "sidebar-logo-expanded" : "sidebar-logo-collapsed"}`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="sidebar-toggle-button"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={useMemo(() => ({ expanded }), [expanded])}>
          <ul className="sidebar-content">{children}</ul>
        </SidebarContext.Provider>

        <div className="sidebar-footer">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="sidebar-user-avatar"
          />
          <div
            className={`sidebar-user-info ${
              expanded ? "sidebar-user-info-expanded" : "sidebar-user-info-collapsed"
            }`}
          >
            <div className="sidebar-user-details">
              <h4 className="sidebar-user-name">John Doe</h4>
              <span className="sidebar-user-email">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}

type SideBarItemProps = {
  icon: any;
  text: string;
  active?: boolean;
  alert?: boolean;
};

export function SidebarItem({ icon, text, active, alert }: Readonly<SideBarItemProps>) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`sidebar-item ${
        active ? "sidebar-item-active" : "sidebar-item-inactive"
      }`}
    >
      {icon}
      <span
        className={`sidebar-item-text ${
          expanded ? "sidebar-item-text-expanded" : "sidebar-item-text-collapsed"
        }`}
      >
        {text}
      </span>
      {alert && <div className={`sidebar-item-alert ${expanded ? "" : "sidebar-item-alert-offset"}`} />}

      {!expanded && (
        <div className="sidebar-item-tooltip">
          {text}
        </div>
      )}
    </li>
  );
}