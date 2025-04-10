import { BreadCrumbs } from "@src/components/BreadCrumbs/BreadCrumbs";
import { SidebarProvider } from "@src/components/Sidebar/contexts/SidebarContexts";
import { Sidebar } from "@src/components/Sidebar/Sidebar";
import { sideBarItems } from "@src/pages/AdminScreen/AdminScreenConfig";
import styles from "@src/pages/Layout/Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.sidebarContainer}`}>
        <SidebarProvider defaultExpanded={true}>
          <Sidebar
            items={sideBarItems}
            onItemClick={(item) => {
              if (item.path) {
                // window.location.href = item.path;
              }
            }}
          />
        </SidebarProvider>
      </div>

      <div className={`${styles.contentContainer}`}>
        <BreadCrumbs />
        {children}
      </div>
    </div>
  );
}