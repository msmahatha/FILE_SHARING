import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, LogOut, Grid, List, Search, Download, Share2, Trash2, Clock, Filter } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { formatBytes, formatDate, getFileCategory } from '../../lib/utils';
import { useThemeStore } from '../../lib/theme-store';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  path: string;
}

export function Dashboard() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    multiple: true,
  });

  useEffect(() => {
    checkAuth();
    loadFiles();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
    }
  }

  async function loadFiles() {
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading files:', error);
      setError('Failed to load files');
      return;
    }

    setFiles(files || []);
    setError(null);
  }

  async function handleFileDrop(acceptedFiles: File[]) {
    setIsUploading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsUploading(false);
      setError('User not authenticated');
      return;
    }

    for (const file of acceptedFiles) {
      try {
        const { data, error: uploadError } = await supabase.storage
          .from('user-files')
          .upload(`${user.id}/${file.name}`, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          setError(`Failed to upload ${file.name}`);
          continue;
        }

        const { error: dbError } = await supabase.from('files').insert({
          name: file.name,
          size: file.size,
          type: file.type,
          path: data.path,
          user_id: user.id,
        });

        if (dbError) {
          console.error('Error saving file metadata:', dbError);
          setError(`Failed to save metadata for ${file.name}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        setError(`Failed to process ${file.name}`);
      }
    }

    setIsUploading(false);
    loadFiles();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  async function handleDelete(fileId: string) {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([file.path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        setError('Failed to delete file from storage');
        return;
      }

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .match({ id: fileId });

      if (dbError) {
        console.error('Error deleting file metadata:', dbError);
        setError('Failed to delete file metadata');
        return;
      }

      setFiles(files.filter(f => f.id !== fileId));
      setError(null);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete file');
    }
  }

  async function handleDownload(file: FileItem) {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .download(file.path);

      if (error) {
        console.error('Error downloading file:', error);
        setError('Failed to download file');
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file');
    }
  }

  async function handleShare(file: FileItem) {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .createSignedUrl(file.path, 3600);

      if (error) {
        console.error('Error creating share link:', error);
        setError('Failed to create share link');
        return;
      }

      await navigator.clipboard.writeText(data.signedUrl);
      setShareUrl(data.signedUrl);
      setTimeout(() => setShareUrl(null), 3000);
      setError(null);
    } catch (err) {
      console.error('Share error:', err);
      setError('Failed to share file');
    }
  }

  const categories = Array.from(new Set(files.map(file => getFileCategory(file.type).category)));

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || getFileCategory(file.type).category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
      {/* Header */}
      <header className="glass-effect shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">File Manager</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm hover:text-opacity-80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {shareUrl && (
          <div className="mb-4 p-4 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-md">
            <p className="text-sm text-green-400">Share link copied to clipboard!</p>
          </div>
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-effect rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="glass-effect rounded-md pl-8 pr-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
            </div>
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="p-2 opacity-70 hover:opacity-100"
            >
              {isGridView ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`mb-8 glass-effect rounded-lg p-8 text-center transition-all ${
            isDragActive ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-2 text-sm opacity-70">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag and drop files here, or click to select files'}
          </p>
        </div>

        {/* File Grid/List */}
        <AnimatePresence>
          <div className={isGridView ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFiles.map((file) => {
              const { category, color } = getFileCategory(file.type);
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`glass-effect rounded-lg overflow-hidden ${
                    isGridView ? '' : 'flex items-center'
                  }`}
                >
                  <div className={`p-4 ${isGridView ? '' : 'flex-1 flex items-center justify-between'}`}>
                    <div className={isGridView ? 'mb-2' : 'flex-1'}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{file.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full glass-effect ${color}`}>
                          {category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-70">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(file.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 ${isGridView ? 'mt-4' : ''}`}>
                      <button
                        onClick={() => handleDownload(file)}
                        className="text-indigo-400 hover:text-indigo-300 p-2"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare(file)}
                        className="text-green-400 hover:text-green-300 p-2"
                        title="Share file"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {/* Upload Progress */}
        {isUploading && (
          <div className="fixed bottom-4 right-4 glass-effect rounded-lg p-4">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
              </div>
              <p className="text-sm opacity-70">Uploading files...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}