import { Route } from "@americanexpress/one-app-router";
import { CompanyDomainPage } from "./pages/CompanyDomain/CompanyDomain";
import { EditorPage } from "./pages/Editor/Editor";
import { HomePage } from "./pages/Home/Home";
import { InitiativesPage } from "./pages/Initiatives/Initiatives";
import { AdminScreenPage } from "./pages/AdminScreen/AdminScreen";
import { PlaybooksPage } from "@src/pages/Playbooks/PlaybooksPage";
import { Layout } from "@src/pages/Layout/Layout";

const childRoutes = () => [
  <Route key="/" path="/" components={HomePage} />,
  <Route key="/company-domains" path="/company-domains" components={CompanyDomainPage} />,
  <Route key="/initiatives" path="/initiatives" components={InitiativesPage} />,
  <Route key="/admin-screens" path="/admin-screens" components={AdminScreenPage} />,
  <Route key="/admin-screens" path="/admin-screens" components={Layout}>
    <Route index key="admin-screen-index" components={AdminScreenPage} />
    <Route key="initiatives" path="initiatives" components={InitiativesPage} />
    <Route key="playbooks" path="playbooks" components={PlaybooksPage} />
  </Route>,
  <Route key="/editor" path="/editor" components={EditorPage} />,
];

export default childRoutes;
