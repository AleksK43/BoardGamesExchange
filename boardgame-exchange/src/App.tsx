import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { LoadingProvider } from './providers/LoadingProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-[#1a0f0f]">
              <main className="flex-1">
                <AppRoutes />
              </main>
            </div>
          </Router>
        </NotificationProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;