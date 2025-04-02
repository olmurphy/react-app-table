import initiattivesIcon from "@src/assets/icons/initiatives_icon.svg";
import initiattivesFilledIcon from "@src/assets/icons/initiatives_filled_icon.svg";
import initiattivesDarkIcon from "@src/assets/icons/initiatives_dark_icon.svg";
import initiattivesDarkFilledIcon from "@src/assets/icons/initiatives_dark_filled_icon.svg";
import companyDomainIcons from "@src/assets/icons/domain_icon.svg";
import companyDomainFilledIcon from "@src/assets/icons/domain_filled_icon.svg";
import companyDomainDarkIcon from "@src/assets/icons/domain_dark_icon.svg";
import companyDomainDarkFilledIcon from "@src/assets/icons/domain_dark_filled_icon.svg";
import codeIcon from "@src/assets/icons/code_icon.svg";
import codeFilledIcon from "@src/assets/icons/code_filled_icon.svg";

type LandingPageCardsType = {
  title: string;
  imgSrc: string;
  imgSrcFilled: string;
  imgSrcDark: string;
  imgSrcDarkFilled: string;
  link: string;
  description: string;
  links?: { label: string; link: string }[];
};

export const LandingPageCards: LandingPageCardsType[] = [
  {
    title: "Initiatives",
    imgSrc: initiattivesIcon,
    imgSrcFilled: initiattivesFilledIcon,
    imgSrcDark: initiattivesDarkIcon,
    imgSrcDarkFilled: initiattivesDarkFilledIcon,
    link: "/",
    description: "Architecture / Design of Enterprise Top Programs / Other initiatives.",
    links: [
      { label: "View Initiatives", link: "google.com" },
      {
        label: "Onboard Initiative",
        link: "/initiatives",
      },
    ],
  },
  {
    title: "Company Domains",
    imgSrc: companyDomainIcons,
    imgSrcFilled: companyDomainFilledIcon,
    imgSrcDark: companyDomainDarkIcon,
    imgSrcDarkFilled: companyDomainDarkFilledIcon,
    link: "/company-domains/",
    description: "Architecture / Design of Platforms within well defined company domains / boundaries.",
    links: [{ label: "View Company Domains", link: "/" }],
  },
  {
    title: "Editor",
    imgSrc: codeIcon,
    imgSrcFilled: codeFilledIcon,
    imgSrcDark: codeIcon,
    imgSrcDarkFilled: codeFilledIcon,
    link: "/editor/",
    description: "Coming Soon...",
  }
];
