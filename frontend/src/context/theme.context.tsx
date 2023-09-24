import React, { createContext, useState, useEffect } from "react";

interface IThemeContextInterface {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const ThemeContext = createContext<IThemeContextInterface>({
    darkMode: false,
    toggleDarkMode: () => {},
});

interface IThemeContextProviderProps {
    children: React.ReactNode;
}

const ThemeContextProvider = ({ children }: IThemeContextProviderProps) => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        // Use a callback function to get the preference from local storage
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === "true";
    });

    // Update the body class when dark mode changes
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prevState) => !prevState);
    };

    // Save the dark mode preference to local storage
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
