import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { AuthBlueProvider, AuthBlueSessionTimeoutModal, OneDataProvider, adsUserAttributes } from "use-authblue-sso";

/**
 * Please review the scope documentation and configure the scope according to your application's needs
 * @see https://github.aexp.com/pages/amex-eng/authblue-documentation/docs/software/use-authblue-sso/
 */
const userAttributesAndGroupsToCollect = {
  attributes: [
    adsUserAttributes.fullName,
    adsUserAttributes.department,
    adsUserAttributes.email,
    adsUserAttributes.managerDistinguishedName,
    adsUserAttributes.adsId,
    adsUserAttributes.guid,
    adsUserAttributes.firstName,
    adsUserAttributes.lastName,
  ],
  groups: [],
};

export function AuthBlueSso(props: any) {
  AuthBlueSso.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const intranetEnv = useSelector((state) => state.getIn(["config", "intranetEnv"]));

  const { children } = props;
  return (
    <AuthBlueProvider env={intranetEnv} scope={userAttributesAndGroupsToCollect}>
      <OneDataProvider>
        {children}
        <AuthBlueSessionTimeoutModal modalPopupTimeInMin={20} />
      </OneDataProvider>
    </AuthBlueProvider>
  );
}
