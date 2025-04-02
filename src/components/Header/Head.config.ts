type NavLink = {
  id: string;
  title: string;
  href: string;
}

export const navLinks: NavLink[] = [
  {
    id: "initiatives",
    title: "Initiatives",
    href: "/initiatives",
  },
  {
    id: "company-domains",
    title: "Company Domains",
    href: "/company-domains",
  },
  {
    id: "editor",
    title: "Editor",
    href: "/editor",
  },
]