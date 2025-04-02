import { useIntl } from "react-intl";
import githubDark from "../../assets/icons/github_dark_icon.svg";
import github from "../../assets/icons/github_icon.svg";
import dark from "../../assets/icons/mode_dark.svg";
import light from "../../assets/icons/mode_light.svg";
import slack from "../../assets/icons/slack.svg";
import { useTheme } from "../../contexts/themeContext";
import styles from "./Header.module.css";

export function Header() {
  const intl = useIntl();
  const { state, dispatch } = useTheme();

  const header = {
    title: intl.formatMessage({ id: "header.title" }),
  };

  const toggleTheme = () => {
    dispatch({
      type: "SET_THEME",
      payload: state.currentTheme === "dark" ? "light" : "dark",
    });
  };

  return (
    <>
      <div className={`${styles.surface} ${styles.navbar} ${styles.underline} ${styles.fixed}`}>
        <header id="dls-nav" role="banner" className="width-full flex flex-align-center flex-justify-between">
          <h2>
            <a href="/">{header.title}</a>
          </h2>
          <div>
            <nav className={styles["nav-links"]}>
              <a href="/initiatives" className={`${styles["nav-link"]} margin-1-l margin-1-r`}>
                Initiatives
              </a>
              <a href="/company-domains" className={`${styles["nav-link"]} margin-1-l margin-1-r`}>
                Company Domains
              </a>
              <a href="/editor" className={`${styles["nav-link"]} margin-1-l margin-1-r`}>
                Editor
              </a>
            </nav>
          </div>

          <div className="nav-icons" style={{ display: "flex", alignItems: "center" }}>
            <span className="margin-1-l margin-1-r">
              <a
                href="https://github.aexp.com/amex-eng/eadpa-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub repository"
                className="icon"
                style={{ width: "24px", height: "24px", display: "inline-block" }}
              >
                <img alt="GitHub icon" src={state.currentTheme === "light" ? githubDark : github} />
              </a>
            </span>
            <span className="margin-1-l margin-1-r">
              <a
                href="slack://open"
                aria-label="Open Slack application"
                className="icon"
                style={{ width: "24px", height: "24px", display: "inline-block" }}
              >
                <img alt="Slack icon" src={slack} />
              </a>
            </span>
            <span className="margin-1-l margin-1-r">Search Bar</span>
            <span className="margin-1-l margin-1-r">Face Icon</span>
            <span className="margin-1-l margin-1-r flex flex-align-center">
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className={`${styles["theme-toggle"]}`}
                style={{ width: "24px", height: "24px", background: "none" }}
              >
                <img
                  className={`${styles["theme-icon"]}`}
                  src={state.currentTheme === "dark" ? dark : light}
                  alt="Theme Toggle Icon"
                />
              </button>
            </span>
          </div>
        </header>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.headerSpacer}></div>
    </>
  );
}
