import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Zagnieżdżone ścieżki z Layout */}
        <Route path="/app" element={<Layout />}>
          <Route path="games" element={<GamesPage />} />
        
          {/* Możemy dodać więcej ścieżek w przyszłości */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;