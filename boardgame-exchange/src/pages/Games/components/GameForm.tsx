import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface GameFormProps {
  onSubmit: (data: GameFormData) => void;
  initialData?: GameFormData;
}

export interface GameFormData {
  title: string;
  condition: 'new' | 'used' | 'damaged';
  category: string;
  description: string;
  images: File[];
}

const GameForm: React.FC<GameFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<GameFormData>(initialData || {
    title: '',
    condition: 'new',
    category: '',
    description: '',
    images: []
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Tworzenie URL-i podglądu
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
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
            condition: e.target.value as GameFormData['condition']
          }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="damaged">Demaged</option>
        </select>
      </div>

      <div>
        <label className="block text-amber-100 font-medieval mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2 
                   border border-amber-500/30 focus:border-amber-500 focus:outline-none"
          required
        >
          <option value="">Choose Category</option>
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
          <option value="card">Card Game</option>
          <option value="board">Board Game</option>
        </select>
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
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Preview zdjęć */}
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