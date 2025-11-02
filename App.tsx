
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import TrainerPage from './pages/TrainerPage';
import ProfilePage from './pages/ProfilePage';
import RecordingsPage from './pages/RecordingsPage';
import GoalsPage from './pages/GoalsPage';

export type Page = 'trainer' | 'recordings' | 'goals' | 'profile';

const App: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('trainer');

    const renderPage = () => {
        switch(currentPage) {
            case 'trainer': return <TrainerPage />;
            case 'recordings': return <RecordingsPage />;
            case 'goals': return <GoalsPage />;
            case 'profile': return <ProfilePage />;
            default: return <TrainerPage />;
        }
    }

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-gradient-to-br from-background to-surface-light text-text-main font-sans flex flex-col items-center justify-center p-4"><LoginPage /></div>;
    }

    return (
        <div className="min-h-screen bg-background text-text-main font-sans">
            <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
                {renderPage()}
            </Layout>
        </div>
    );
};

export default App;