import { Routes, Route } from 'react-router-dom';
import AddGame from './components/AddGame';
import MyGames from './components/MyGames';
import TrashGames from './components/TrashGames';

const Games = () => {
  return (
    <Routes>
      <Route path="add" element={<AddGame />} />
      <Route path="my-games" element={<MyGames />} />
      <Route path="trash" element={<TrashGames />} />
    </Routes>
  );
};

export default Games;