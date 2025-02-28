import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Settings } from '@/pages/Settings';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        className="print:hidden"
        onNavigate={setCurrentPath}
        activePath={currentPath}
      />
      <div className="md:pl-[250px] pt-16 md:pt-0">
        {renderContent()}
      </div>
      <Toaster />
    </div>
  );
}

export default App;