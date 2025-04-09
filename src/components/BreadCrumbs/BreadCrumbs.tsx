import { Breadcrumb, BreadcrumbTrail } from "@americanexpress/dls-react";
import { browserHistory } from "@americanexpress/one-app-router";
import homeDarkIcon from "@src/assets/icons/home_dark_icon.svg";
import homeIcon from "@src/assets/icons/home_icon.svg";
import styles from "@src/components/BreadCrumbs/BreadCrumbs.module.css";
import { useTheme } from "@src/contexts/themeContext";

export function BreadCrumbs() {
  const { state } = useTheme();
  const currentLocation = browserHistory.getCurrentLocation();
  const pathSegments = currentLocation.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment: string, index: number) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    return (
      <Breadcrumb className={styles.breadcrumb} key={href} href={href}>
        {label}
      </Breadcrumb>
    );
  });
  return (
    <div className={`${styles.container}`}>
      <BreadcrumbTrail>
        <Breadcrumb>
          <a href="/">
            <img
              style={{ width: "15px", height: "15px" }}
              alt="home icon"
              src={state.currentTheme === "dark" ? homeIcon : homeDarkIcon}
            />
          </a>
        </Breadcrumb>
        {breadcrumbs}
      </BreadcrumbTrail>
    </div>
  );
}
