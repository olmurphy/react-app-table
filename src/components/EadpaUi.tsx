import { ProgressCircular } from "@americanexpress/dls-react";
import { loadLanguagePack } from "@americanexpress/one-app-ducks";
import oneAppModuleWrapper from "@americanexpress/one-app-module-wrapper";
import styles from "@src/assets/styles/global.css";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { IntlProvider } from "react-intl";
import childRoutes from "../childRoutes";
import { ThemeProvider } from "../contexts/themeContext";
import { UserProvider } from "../contexts/userContext";
import { logger } from "../utils/logger";
import Footer from "./Footer/Footer";
import { Header } from "./Header/Header";

function useComponentRenderTime(componentName: string) {
  const comoponentRef = useRef(null);

  useEffect(() => {
    performance.mark(`${componentName}_start`);
    return () => {
      performance.mark(`${componentName}_end`);
      performance.measure(`${componentName}_duration`, `${componentName}_start`, `${componentName}_end`);
      const measures = performance.getEntriesByName(`${componentName}_duration`);
      if (measures.length > 0) {
        const durection = measures[0].duration;
        logger.info(`${componentName} render time: ${durection}ms`);
      }

      performance.clearMarks(`${componentName}_start`);
      performance.clearMarks(`${componentName}_end`);
      performance.clearMarks(`${componentName}_duration`);
    };
  });

  return comoponentRef;
}

const EadpaUi = ({ children, languageData, locale }) => {
  const comoponentRef = useComponentRenderTime("EadpaUi");

  if (Object.entries(languageData).length === 0) {
    return <ProgressCircular />;
  }

  return (
    <div className={`${styles.root}`} ref={comoponentRef}>
      <IntlProvider locale={locale} messages={languageData}>
        {/* <AuthBlueSso> */}
        <UserProvider>
          <ThemeProvider>
            <Helmet
              htmlAttributes={{ lang: locale, "data-dls-mode": "light" }}
              link={[
                {
                  rel: "stylesheet",
                  href: "https://www.aexp-static.com/cdaas/dls/packages/@americanexpress/dls/7.0.0/stylesheets/dls-core.min.css",
                },
                {
                  rel: "icon",
                  href: "/static/favicon.ico",
                },
              ]}
            />
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </UserProvider>
        {/* </AuthBlueSso> */}
      </IntlProvider>
    </div>
  );
};

export const TestableEadpaUi = EadpaUi;

EadpaUi.propTypes = {
  languageData: PropTypes.shape({}).isRequired, // no need to restate all the keys in the lang pack
  locale: PropTypes.string.isRequired,
};

// Read about childRoutes:
// https://github.com/americanexpress/one-app/blob/main/docs/api/modules/Routing.md#childroutes
EadpaUi.childRoutes = childRoutes;

// Read about appConfig:
// https://github.com/americanexpress/one-app/blob/main/docs/api/modules/App-Configuration.md
/* istanbul ignore next */
if (!global.BROWSER) {
  // eslint-disable-next-line global-require -- require needs to be inside browser check
  EadpaUi.appConfig = require("../appConfig").default;
}

if (global.BROWSER) {
  console.log("this is run in browser");
  const { initWebVitals } = require("../utils/performance");
  initWebVitals();
}

export const loadModuleData = ({ store: { dispatch } }) =>
  dispatch(loadLanguagePack("eadpa-ui", { fallbackLocale: "en-US" }));

EadpaUi.holocron = {
  name: "eadpa-ui",
  loadModuleData,
};

export default oneAppModuleWrapper("eadpa-ui")(EadpaUi);
