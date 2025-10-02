'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UploadBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle cover image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload book with cover
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coverFile) {
      setMessage('Please select a cover image');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      // 1. Upload cover image to Supabase Storage
      const fileExt = coverFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `books/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, coverFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 2. Get public URL of uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      console.log('Cover uploaded! URL:', publicUrl);

      // 3. Insert book into database with cover URL
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert({
          title,
          author,
          description,
          cover_url: publicUrl,
          is_featured: false,
          is_published: true,
        })
        .select()
        .single();

      if (bookError) throw bookError;

      setMessage(`✅ Book "${title}" uploaded successfully!`);
      console.log('Book created:', bookData);

      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setCoverFile(null);
      setCoverPreview('');

    } catch (error: any) {
      console.error('Error uploading:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Upload New Book</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image *
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleCoverChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
            {coverPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Enter book title"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Enter author name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3"
              rows={4}
              placeholder="Enter book description"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload Book'}
          </button>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-md ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


