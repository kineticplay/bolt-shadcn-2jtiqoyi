import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/Login';
import { Button } from '@/components/ui/button';

function App() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="container mx-auto p-14 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <Button onClick={() => logout()} variant="outline">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default App;