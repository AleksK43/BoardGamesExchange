import React from 'react';
import { GameFilters as GameFiltersType } from '../types/filters';
import { GameCategory, GameCondition, GameDifficulty } from '../types/game';

interface GameFiltersProps {
  filters: GameFiltersType;
  onFiltersChange: (filters: GameFiltersType) => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <select
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.category || ''}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as GameCategory || null })}
      >
        <option value="">All categories</option>
        <option value="board">Board Game</option>
        <option value="card">Card Game</option>
        <option value="rpg">RPG</option>
        <option value="strategy">Strategy</option>
      </select>

      <select
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.condition || ''}
        onChange={(e) => onFiltersChange({ ...filters, condition: e.target.value as GameCondition || null })}
      >
        <option value="">All conditions</option>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="damaged">Damaged</option>
      </select>

      <select
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.difficulty || ''}
        onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value as GameDifficulty || null })}
      >
        <option value="">All difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
        <option value="expert">Expert</option>
      </select>

      <input
        type="number"
        placeholder="Min players"
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.minPlayers || ''}
        onChange={(e) => onFiltersChange({ ...filters, minPlayers: e.target.value ? Number(e.target.value) : null })}
      />

      <input
        type="number"
        placeholder="Max players"
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.maxPlayers || ''}
        onChange={(e) => onFiltersChange({ ...filters, maxPlayers: e.target.value ? Number(e.target.value) : null })}
      />

      <input
        type="text"
        placeholder="City"
        className="bg-amber-100/10 rounded-lg py-2 px-4 text-amber-100"
        value={filters.city || ''}
        onChange={(e) => onFiltersChange({ ...filters, city: e.target.value || null })}
      />
    </div>
  );
};

export default GameFilters;