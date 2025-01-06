import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { gameService } from '../../../services/api';
import { GameCategory, GameCondition, GameDifficulty, GameFormData, CreateGameData } from '../../../types/game';

interface ImageFile {
  file?: File;
  preview: string;
  isUrl?: boolean;
}

const GameForm: React.FC = () => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    category: 'rpg' as GameCategory,
    condition: 'used' as GameCondition,
    numberOfPlayers: 2,
    availableFrom: new Date(),
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'medium' as GameDifficulty,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: GameFormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleAddImageUrl = () => {
    if (currentUrl && isValidUrl(currentUrl)) {
      setSelectedImages(prev => [...prev, {
        preview: currentUrl,
        isUrl: true
      }]);
      setCurrentUrl('');
    } else {
      showNotification('error', 'Please enter a valid image URL');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Usuwamy prefix "data:image/xxx;base64," z wyniku
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) return;

    try {
      setIsSubmitting(true);

      // Step 1: Create the game
      const gameDataToSend: CreateGameData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        numberOfPlayers: formData.numberOfPlayers,
        availableFrom: formData.availableFrom.toISOString(),
        availableTo: formData.availableTo.toISOString(),
        difficulty: formData.difficulty
      };

      const createdGame = await gameService.addGame(gameDataToSend);

  const convertImageToUrl = async (file: File): Promise<string> => {
    // Tymczasowo - tworzymy symulowany URL
    return `/images/${file.name}`;
    // Docelowo tutaj byłby upload pliku na serwer i zwracanie prawdziwego URL
  };

  // Step 2: Upload images if there are any
  if (selectedImages.length > 0) {
    for (const image of selectedImages) {
      let imageUrl: string;
      let filename: string;

      if (image.isUrl) {
        imageUrl = image.preview;
        filename = image.preview.split('/').pop() || 'image.jpg';
      } else if (image.file) {
        imageUrl = await convertImageToUrl(image.file);
        filename = image.file.name;
      } else {
        continue;
      }

      const imagePayload = {
        filename: filename,
        data: imageUrl,  
        boardGameId: createdGame.id,
        id: 0,
        createDate: new Date()
      };

      try {
        await gameService.addGameImage(createdGame.id, imagePayload);
      } catch (error) {
        console.error('Error adding image:', error);
        showNotification('error', `Failed to add image ${filename}`);
      }
    }
      }

      showNotification('success', 'Game added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'rpg' as GameCategory,
        condition: 'used' as GameCondition,
        numberOfPlayers: 2,
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        difficulty: 'medium' as GameDifficulty,
      });
      
      // Clear images
      selectedImages.forEach(image => URL.revokeObjectURL(image.preview));
      setSelectedImages([]);

    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Failed to add game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#2c1810]/50 rounded-lg p-6 border border-amber-900/30"
    >
      {/* Title */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        />
      </div>

      {/* Game Condition */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Condition
        </label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
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

      {/* Number of Players */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Number of Players
        </label>
        <input
          type="number"
          name="numberOfPlayers"
          min="1"
          value={formData.numberOfPlayers}
          onChange={handleInputChange}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none
                   min-h-[150px]"
          required
        />
      </div>

      {/* Image Upload and URL Input */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Images
        </label>
        <div className="space-y-4">
          {/* Image Upload */}
          <label className="block cursor-pointer">
            <div className="flex items-center justify-center w-full h-32 border-2 
                          border-dashed border-amber-500/30 rounded-lg hover:border-amber-500
                          transition-colors">
              <div className="flex flex-col items-center">
                <Plus className="w-8 h-8 text-amber-500" />
                <span className="mt-2 text-sm text-amber-400">Upload Images</span>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </label>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="Or paste image URL here..."
              className="flex-1 bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                       border border-amber-500/30 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              disabled={!isValidUrl(currentUrl)}
              className="px-4 py-2 bg-amber-700 text-amber-100 rounded-lg 
                       hover:bg-amber-600 transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Image Preview */}
        {selectedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-amber-100 font-medieval mb-2">
            Available From
          </label>
          <input
            type="date"
            name="availableFrom"
            value={formData.availableFrom.toISOString().split('T')[0]}
            onChange={(e) => setFormData((prev: GameFormData) => ({
              ...prev,
              availableFrom: new Date(e.target.value)
            }))}
            className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                     border border-amber-500/30 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-amber-100 font-medieval mb-2">
            Available To
          </label>
          <input
            type="date"
            name="availableTo"
            value={formData.availableTo.toISOString().split('T')[0]}
            onChange={(e) => setFormData((prev: GameFormData) => ({
              ...prev,
              availableTo: new Date(e.target.value)
            }))}
            className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                     border border-amber-500/30 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700
                 hover:from-amber-700 hover:to-amber-800 text-amber-100 rounded-lg 
                 transition-colors font-medieval text-lg shadow-lg
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding Game...' : 'Add Game'}
      </button>
    </form>
  );
};

export default GameForm;