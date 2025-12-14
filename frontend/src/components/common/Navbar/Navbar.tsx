import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import './Navbar.scss';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, cycleTheme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const [userRole, setUserRole] = useState<string | null>(null);

    // Simple check to see if we are in a "logged in" area
    const isLoggedInArea = location.pathname.match(/\/(student|teacher|tanar|group|diak)/);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setUserRole(storedRole);

        const handleStorageChange = () => {
            setUserRole(localStorage.getItem('role'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location.pathname]);

    return (
        <nav className="navbar fixed-top">
            <div className="navbar-container">
                <div className="navbar-left">
                    {isLoggedInArea ? (
                        <div className="navbar-links">
                            {(userRole === 'student' || userRole === 'diak') && (
                                <button onClick={() => navigate('/student')}>{t("nav.studentDashboard")}</button>
                            )}
                            {(userRole === 'teacher' || userRole === 'tanar') && (
                                <button onClick={() => navigate('/teacher')}>{t("nav.teacherDashboard")}</button>
                            )}

                            {location.pathname !== '/student' && location.pathname !== '/teacher' && (
                                <button className="nav-back-btn" onClick={() => navigate(-1)}>
                                    {location.pathname.includes('/quiz/') ? t("nav.classroom") : t("nav.back")}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="navbar-links">
                            <button onClick={() => navigate('/login')}>{t("nav.login")}</button>
                            <button onClick={() => navigate('/register')}>{t("nav.register")}</button>
                        </div>
                    )}
                </div>

                <div className="navbar-right">
                    <div className="language-selector">
                        <select
                            className="form-select"
                            value={lang}
                            onChange={(e) => setLang(e.target.value as "HU" | "EN" | "DE")}
                        >
                            <option value="HU">HU</option>
                            <option value="EN">EN</option>
                            <option value="DE">DE</option>
                        </select>
                    </div>

                    <button className="theme-toggle" onClick={cycleTheme} title={`Téma: ${theme}`}>
                        {theme === 'light' && '☀️'}
                        {theme === 'light-warm' && '🌅'}
                        {theme === 'dark' && '🌙'}
                        {theme === 'dark-deep' && '🌑'}
                    </button>

                    {isLoggedInArea && (
                        <button className="btn btn-danger" onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('role');
                            navigate('/login');
                        }}>
                            {t("nav.logout")}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
