import React from 'react';
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { sideBarItems } from "../pages/AdminScreen/AdminScreenConfig";
import { useSidebar } from "../components/Sidebar/contexts/SidebarContexts";
import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar
          items={sideBarItems}
          onItemClick={(item) => {
            if (item.path) {
              // window.location.href = item.path;
            }
          }}
        />
      </div>
      
      <div className={styles.contentContainer}>
        <BreadCrumbs />
        {children}
      </div>
    </div>
  );
}
