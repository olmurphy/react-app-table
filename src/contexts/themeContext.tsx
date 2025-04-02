import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import styles from "@src/assets/styles/theme.css";
import React, { createContext, Dispatch, FC, useContext, useEffect, useMemo, useReducer } from "react";
import { lightTheme, darkTheme } from "@src/components/Table/Table.styles";

type Theme = "light" | "dark" | "system";

type ThemeState = {
  currentTheme: Theme;
  primaryColor: string;
  backgroundColor: string;
};

type ThemeAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_PRIMARY_COLOR"; payload: string }
  | { type: "SET_BACKGROUND_COLOR"; payload: string };

const initialThemState: ThemeState = {
  currentTheme: "light",
  primaryColor: "#007bff",
  backgroundColor: "#ffffff",
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, currentTheme: action.payload };
    case "SET_PRIMARY_COLOR":
      return { ...state, primaryColor: action.payload };
    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.payload };
    default:
      return state;
  }
};

const ThemeContext = createContext<
  | {
      state: ThemeState;
      dispatch: Dispatch<ThemeAction>;
    }
  | undefined
>(undefined);

export const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialThemState);

  // Detect system theme and apply it if "system" is selected
  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const savedTheme = localStorage.getItem("theme") as Theme;

    const themeToApply = savedTheme || state.currentTheme === "system" ? systemTheme : state.currentTheme;
    document.documentElement.className = themeToApply;
    dispatch({ type: "SET_THEME", payload: themeToApply });
  }, []);

  // Update theme class on the root element and save preference
  useEffect(() => {
    if (state.currentTheme !== "system") {
      document.documentElement.className = state.currentTheme;
      localStorage.setItem("theme", state.currentTheme);
    }
  }, [state.currentTheme]);

  const muiTheme = useMemo(() => state.currentTheme === "light" ? lightTheme : darkTheme, [state.currentTheme]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider value={value}>
        <div className={styles.theme} data-theme={state.currentTheme}>
          {children}
        </div>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
