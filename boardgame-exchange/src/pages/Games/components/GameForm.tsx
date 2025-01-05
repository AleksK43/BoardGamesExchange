import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Game } from '../../../types/game';
import { gameService } from '../../../services/api';
import { useNotification } from '../../../providers/NotificationProvider';
import { useAuth } from '../../../providers/AuthProvider';

const GameForm: React.FC<{ onSubmit?: (game: Game) => void }> = ({ onSubmit }) => {
  const { showNotification } = useNotification();
  const { user } = useAuth();

  const [formData, setFormData] = useState<Game>({
    id: '', 
    title: '',
    description: '',
    imageBase64: '',
    category: 'rpg',
    numberOfPlayers: 0,
    condition: 'used',
    availableFrom: new Date(),
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'medium',
    createDate: new Date(),
    owner: user ? {
        id: user.id,
        email: user.email,
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        city: user.city || ''
    } : {
        id: 0,
        email: '',
        firstname: '',
        lastname: '',
        city: ''
    } 
});

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Konwersja pierwszego pliku do base64
    if (files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageBase64: reader.result as string
        }));
      };
    }

    // Podgląd obrazów
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(newPreviews);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      imageBase64: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newGame = await gameService.addGame(formData);
      
      showNotification('success', 'Game added successfully');
      
      // Opcjonalne wywołanie przekazanej funkcji onSubmit
      onSubmit?.(newGame);
      
      // Resetowanie formularza
      setFormData({
        id: '',
        title: '',
        description: '',
        category: 'rpg',
        condition: 'used',
        numberOfPlayers: 0,
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        difficulty: 'medium',
        imageBase64: '',
        createDate: new Date(),
        owner: user ? {
          id: user.id,
          email: user.email,
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          city: user.city || ''
        } : {
          id: 0,
          email: '',
          firstname: '',
          lastname: '',
          city: ''
        }
      });
      setPreviewImages([]);
    } catch (error) {
      showNotification('error', 'Failed to add game');
      console.error(error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#2c1810]/50 rounded-lg p-6 border border-amber-900/30"
    >
      {/* Tytuł */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        />
      </div>

      {/* Stan gry */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Condition
        </label>
        <select
          value={formData.condition}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            condition: e.target.value as Game['condition'],
            difficulty: e.target.value === 'new' ? 'easy' : 
                        e.target.value === 'used' ? 'medium' : 'hard'
          }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      {/* Kategoria */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Game['category'] }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
          <option value="card">Card Game</option>
          <option value="board">Board Game</option>
        </select>
      </div>

      {/* Liczba graczy */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Number of Players
        </label>
        <input
          type="number"
          value={formData.numberOfPlayers}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            numberOfPlayers: parseInt(e.target.value) 
          }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        />
      </div>

      {/* Opis */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none
                   min-h-[150px]"
          required
        />
      </div>

      {/* Upload zdjęć */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Photos
        </label>
        <div className="space-y-4">
          <label className="block w-full border-2 border-dashed border-amber-500/50 
                         rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 
                         transition-colors">
            <Upload className="mx-auto h-12 w-12 text-amber-500" />
            <span className="mt-2 block text-amber-100">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Preview zdjęć */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daty dostępności */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-amber-100 font-medieval mb-2">
            Available From
          </label>
          <input
            type="date"
            value={formData.availableFrom.toISOString().split('T')[0]}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              availableFrom: new Date(e.target.value) 
            }))}
            className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                     border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-amber-100 font-medieval mb-2">
            Available To
          </label>
          <input
            type="date"
            value={formData.availableTo.toISOString().split('T')[0]}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              availableTo: new Date(e.target.value) 
            }))}
            className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                     border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700
                 hover:from-amber-700 hover:to-amber-800 text-amber-100 rounded-lg 
                 transition-colors font-medieval text-lg shadow-lg"
      >
        Add Game
      </button>
    </form>
  );
};

export default GameForm;