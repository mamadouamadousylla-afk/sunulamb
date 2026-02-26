import React from 'react';

interface UploadButtonProps {
  endpoint: string;
  onClientUploadComplete?: (res: any) => void;
  onUploadError?: (error: Error) => void;
}

export const UploadButton = ({ endpoint, onClientUploadComplete, onUploadError }: UploadButtonProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
      <p className="text-gray-500">Cliquez pour télécharger une image</p>
      <input type="file" className="hidden" />
    </div>
  );
};