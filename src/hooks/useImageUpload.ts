import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadImage, EntityType } from '@/services/uploadImageService';
import { useResultHandler } from './useResultHandler';

interface UseImageUploadProps {
  entityType: EntityType;
  entityId: string;
  onImageChange: (url: string) => void;
}

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadImage: (imageFile: File) => Promise<void>;
  resetUpload: () => void;
}

/**
 * Custom hook for handling image uploads
 */
export const useImageUpload = ({
  entityType,
  entityId,
  onImageChange
}: UseImageUploadProps): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const { handleApiResult } = useResultHandler();

  const uploadImageHandler = useCallback(async (imageFile: File) => {
    if (!entityId) {
      toast.error('Entity ID required');
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadImage(
        imageFile,
        entityType,
        entityId
      );

      if (response.success) {
        const newImageUrl = response.data.img;
        onImageChange(newImageUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error: any) {
      handleApiResult(error, 'Upload Image');
    } finally {
      setIsUploading(false);
    }
  }, [entityType, entityId, onImageChange, handleApiResult]);

  const resetUpload = useCallback(() => {
    setIsUploading(false);
  }, []);

  return {
    isUploading,
    uploadImage: uploadImageHandler,
    resetUpload
  };
};

export default useImageUpload;
