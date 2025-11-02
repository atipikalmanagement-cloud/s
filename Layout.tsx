
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Page } from '../App';
import { useAuth } from '../hooks/useAuth';
import { LOGO_BASE64 } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
  
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>

            {/* Mobile sidebar with overlay */}
            <div 
                className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden ${sidebarOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            >
                <div 
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Sidebar currentPage={currentPage} setCurrentPage={(page) => {
                        setCurrentPage(page);
                        setSidebarOpen(false);
                    }} />
                </div>
            </div>

            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between bg-surface p-4 border-b border-surface-light">
                    <button onClick={() => setSidebarOpen(true)} className="text-text-main">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <img src={LOGO_BASE64} alt="Digital Revolution Logo" className="h-8" />
                    <img src={user?.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                </header>
                
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 sm:p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;