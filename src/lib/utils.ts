import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function getFileCategory(type: string): {
  category: string;
  color: string;
} {
  const categories = {
    'application/pdf': { category: 'PDF', color: 'text-red-400' },
    'application/msword': { category: 'Document', color: 'text-blue-400' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { category: 'Document', color: 'text-blue-400' },
    'application/vnd.ms-excel': { category: 'Spreadsheet', color: 'text-green-400' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { category: 'Spreadsheet', color: 'text-green-400' },
    'application/vnd.ms-powerpoint': { category: 'Presentation', color: 'text-orange-400' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { category: 'Presentation', color: 'text-orange-400' },
    'text/plain': { category: 'Text', color: 'text-gray-400' },
    'text/html': { category: 'Code', color: 'text-purple-400' },
    'text/css': { category: 'Code', color: 'text-purple-400' },
    'text/javascript': { category: 'Code', color: 'text-purple-400' },
    'application/json': { category: 'Code', color: 'text-purple-400' },
    'image/jpeg': { category: 'Image', color: 'text-pink-400' },
    'image/png': { category: 'Image', color: 'text-pink-400' },
    'image/gif': { category: 'Image', color: 'text-pink-400' },
    'image/svg+xml': { category: 'Image', color: 'text-pink-400' },
    'video/mp4': { category: 'Video', color: 'text-yellow-400' },
    'video/quicktime': { category: 'Video', color: 'text-yellow-400' },
    'audio/mpeg': { category: 'Audio', color: 'text-cyan-400' },
    'audio/wav': { category: 'Audio', color: 'text-cyan-400' },
    'application/zip': { category: 'Archive', color: 'text-gray-400' },
    'application/x-rar-compressed': { category: 'Archive', color: 'text-gray-400' },
    'application/x-7z-compressed': { category: 'Archive', color: 'text-gray-400' },
  };

  return categories[type as keyof typeof categories] || { category: 'Other', color: 'text-gray-400' };
}