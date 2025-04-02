import React, { createContext, FC, useCallback, useEffect, useMemo } from "react";
import { useAuthBlueSso } from "use-authblue-sso";
interface User {
  id: string; // guid
  username: string; // adsId
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  sessionId: string;
  roles: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuthBlueSso();
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    if (authUser) {
      console.log(authUser);
      const mappedUser: User = {
        id: authUser.attributes.guid,
        username: authUser.attributes.adsId,
        fullName: authUser.attributes.fullName,
        firstName: authUser.attributes.firstName,
        lastName: authUser.attributes.lastName,
        email: authUser.attributes.email,
        department: authUser.attributes.department,
        sessionId: authUser.attributes.guid, // Assuming sessionId is the same as guid
        roles: authUser.groups,
      };
      setUser(mappedUser);
    }
  }, [authUser]);

  useEffect(() => {
    if (user) {
      console.log("User logged in", user);
    }
  }, [user]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const hasRole = useCallback((role: string) => user?.roles.includes(role) ?? false, [user]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      hasRole,
      logout,
    }),
    [user, setUser, isAuthenticated, hasRole, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
