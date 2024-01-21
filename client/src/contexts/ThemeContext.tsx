import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  themeValue: "light" | "dark";
  setThemeValue: Dispatch<SetStateAction<"light" | "dark">>;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeValue: "light",
  setThemeValue: () => {},
});

interface ThemeContextProps {
  children: ReactNode;
  initial?: "light" | "dark";
}

export const ThemeContextProvider: FC<ThemeContextProps> = ({
  children,
  initial = "light",
}) => {
  const [themeValue, setThemeValue] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? (storedTheme as "light" | "dark") : initial;
  });

  useEffect(() => {
    const html = document.querySelector("html");

    if (html) html.classList.toggle("dark", themeValue === "dark");

    localStorage.setItem("theme", themeValue);
  }, [themeValue]);
  return (
    <ThemeContext.Provider value={{ themeValue, setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
};
