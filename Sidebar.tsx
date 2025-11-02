
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Page } from '../App';
import { LOGO_BASE64 } from '../constants';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    icon: string;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}> = ({ page, label, icon, currentPage, setCurrentPage }) => {
    const isActive = currentPage === page;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-highlight text-background' : 'text-gray-300 hover:bg-surface-light hover:text-text-main'}`}
            >
                <i className={`fas ${icon} w-6 text-center`}></i>
                <span className="ml-4 font-semibold">{label}</span>
            </a>
        </li>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-background text-text-main flex flex-col p-4 border-r border-surface-light h-full">
        <div className="px-4 mb-10 pt-4">
             <img src={LOGO_BASE64} alt="Digital Revolution Logo" className="w-full" />
        </div>

        <nav className="flex-1">
            <ul className="space-y-3">
               <NavItem page="trainer" label="Treinador" icon="fa-microphone-alt" currentPage={currentPage} setCurrentPage={setCurrentPage} />
               <NavItem page="recordings" label="Gravações" icon="fa-history" currentPage={currentPage} setCurrentPage={setCurrentPage} />
               <NavItem page="goals" label="Metas" icon="fa-bullseye" currentPage={currentPage} setCurrentPage={setCurrentPage} />
               <NavItem page="profile" label="Perfil" icon="fa-user-cog" currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </ul>
        </nav>

        <div className="mt-auto">
            <div className="flex items-center p-3 rounded-lg bg-surface/50 mb-3">
                <img src={user?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full mr-3 border-2 border-highlight" />
                <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
            </div>
             <button
                onClick={logout}
                className="w-full flex items-center justify-center p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
                <i className="fas fa-sign-out-alt w-6 text-center"></i>
                <span className="ml-4 font-medium">Sair</span>
            </button>
        </div>
    </aside>
  );
};

export default Sidebar;