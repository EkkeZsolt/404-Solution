import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="app-content" style={{ paddingTop: '64px' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
