import { Routes, Route } from 'react-router-dom';
import AddGame from './components/AddGame';

const Games = () => {
  return (
    <Routes>
      <Route path="/add" element={<AddGame />} />
      {/* inne podścieżki dla sekcji Games */}
    </Routes>
  );
};

export default Games;