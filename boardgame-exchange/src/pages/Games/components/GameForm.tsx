import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useNotification } from '../../../providers/NotificationProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { gameService } from '../../../services/api';
import { GameCategory, GameCondition, GameDifficulty } from '../../../types/game';

export interface GameFormData {
  title: string;
  description: string;
  category: GameCategory;
  condition: GameCondition;
  numberOfPlayers: number;
  availableFrom: Date;
  availableTo: Date;
  difficulty: GameDifficulty;
}

interface GameFormProps {
  onSubmit: (data: GameFormData) => Promise<void>;
}

interface ImageFile {
  file?: File;
  preview: string;
  isUrl?: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ onSubmit }) => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    description: '',
    category: 'rpg',
    condition: 'used',
    numberOfPlayers: 2,
    availableFrom: new Date(),
    availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    difficulty: 'medium'
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'numberOfPlayers') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      if (!newImages[index].isUrl && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64data = reader.result.split(',')[1];
          resolve(base64data);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !user) return;

    try {
      setIsSubmitting(true);

      const createdGame = await gameService.addGame({
        ...formData,
        availableFrom: formData.availableFrom.toISOString(),
        availableTo: formData.availableTo.toISOString()
      });

      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          let imageData: string;
          let filename: string;

          if (image.isUrl) {
            imageData = image.preview;
            filename = image.preview.split('/').pop() || 'image.jpg';
          } else if (image.file) {
            imageData = await fileToBase64(image.file);
            filename = image.file.name;
          } else {
            continue;
          }

          const imagePayload = {
            filename,
            data: imageData,
            boardGameId: createdGame.id,
            createDate: new Date()
          };

          await gameService.addGameImage(createdGame.id, imagePayload);
        }
      }

      showNotification('success', 'Game added successfully!');
      
      setFormData({
        title: '',
        description: '',
        category: 'rpg',
        condition: 'used',
        numberOfPlayers: 2,
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        difficulty: 'medium'
      });
      
      selectedImages.forEach(image => {
        if (!image.isUrl && image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
      setSelectedImages([]);

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Failed to add game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Condition */}
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

      {/* Difficulty */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Difficulty
        </label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
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
                   min-h-[150px] resize-y"
          required
        />
      </div>

      {/* Availability Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-amber-100 font-medieval mb-2">
            Available From
          </label>
          <input
            type="date"
            name="availableFrom"
            value={formData.availableFrom.toISOString().split('T')[0]}
            onChange={(e) => setFormData(prev => ({
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
            onChange={(e) => setFormData(prev => ({
              ...prev,
              availableTo: new Date(e.target.value)
            }))}
            className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                     border border-amber-500/30 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Images
        </label>
        <div className="space-y-4">
          {/* File Upload */}
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

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700
                 hover:from-amber-700 hover:to-amber-800 text-amber-100 rounded-lg 
                 transition-colors font-medieval text-lg
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-amber-100 border-t-transparent 
                         rounded-full animate-spin" />
            <span>Adding Game...</span>
          </>
        ) : (
          <span>Add Game</span>
        )}
      </button>
    </form>
  );
};

export default GameForm;