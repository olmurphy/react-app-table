import React, { useContext, createContext, useState, useMemo } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import styles from "./Sidebar.module.css"; // Import the CSS module

const SidebarContext = createContext({ expanded: true });

type SideBarProps = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: Readonly<SideBarProps>) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={styles.sidebar}>
      <nav className={`${styles.sidebarNav} ${styles.container}`}>
        <div className={styles.sidebarHeader}>
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`${styles.sidebarLogo} ${
              expanded ? styles.sidebarLogoExpanded : styles.sidebarLogoCollapsed
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={styles.sidebarToggleButton}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={useMemo(() => ({ expanded }), [expanded])}>
          <ul className={styles.sidebarContent}>{children}</ul>
        </SidebarContext.Provider>

        <div className={styles.sidebarFooter}>
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className={styles.sidebarUserAvatar}
          />
          <div
            className={`${styles.sidebarUserInfo} ${
              expanded ? styles.sidebarUserInfoExpanded : styles.sidebarUserInfoCollapsed
            }`}
          >
            <div className={styles.sidebarUserDetails}>
              <h4 className={styles.sidebarUserName}>John Doe</h4>
              <span className={styles.sidebarUserEmail}>[REDACTED_EMAIL_ADDRESS_1]</span>
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
      className={`${styles.sidebarItem} ${
        active ? styles.sidebarItemActive : styles.sidebarItemInactive
      }`}
    >
      {icon}
      <span
        className={`${styles.sidebarItemText} ${
          expanded ? styles.sidebarItemTextExpanded : styles.sidebarItemTextCollapsed
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`${styles.sidebarItemAlert} ${
            expanded ? "" : styles.sidebarItemAlertOffset
          }`}
        />
      )}

      {!expanded && <div className={styles.sidebarItemTooltip}>{text}</div>}
    </li>
  );
}