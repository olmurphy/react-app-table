import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { LandingCards } from "@src/components/LandingCards/LandingCards";

export function HomePage() {
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: "helmet.title" })}</title>
      </Helmet>
      <div>
        <LandingCards />
      </div>
    </>
  );
}
