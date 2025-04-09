import { Route } from "@americanexpress/one-app-router";
import { AdminScreenPage } from "@src/pages/AdminScreen/AdminScreen";
import { CompanyDomainPage } from "@src/pages/CompanyDomain/CompanyDomain";
import { EditorPage } from "@src/pages/Editor/Editor";
import { HomePage } from "@src/pages/Home/Home";
import { InitiativesPage } from "@src/pages/Initiatives/Initiatives";
import { Layout } from "@src/pages/Layout/Layout";
import { PlaybooksPage } from "@src/pages/Playbooks/Playbooks";

const childRoutes = () => [
  <Route key="/" path="/" components={HomePage} />,
  <Route key="/company-domains" path="/company-domains" components={CompanyDomainPage} />,
  <Route key="/admin-screens" path="/admin-screens" components={Layout}>
    <Route index key="admin-screen-index" components={AdminScreenPage} />
    <Route key="initiatives" path="initiatives" components={InitiativesPage} />
    <Route key="playbooks" path="playbooks" components={PlaybooksPage} />
  </Route>,
  <Route key="/editor" path="/editor" components={EditorPage} />,
];

export default childRoutes;
