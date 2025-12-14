import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'light-warm' | 'dark' | 'dark-deep';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Remove all theme classes first
        document.body.classList.remove('light', 'light-warm', 'dark', 'dark-deep', 'dark-mode');
        // Add current theme class
        document.body.classList.add(theme);

        // Backward compatibility for dark-mode style checks if needed
        if (theme.startsWith('dark')) {
            document.body.classList.add('dark-mode');
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const cycleTheme = () => {
        const themes: Theme[] = ['light', 'light-warm', 'dark', 'dark-deep'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setThemeState(themes[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
