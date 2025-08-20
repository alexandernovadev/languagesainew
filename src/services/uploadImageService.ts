import { api } from './api';

export interface UploadImageResponse {
  success: boolean;
  data: {
    img: string;
    entityId: string;
    entityType: string;
  };
  message: string;
}

export type EntityType = 'word' | 'lecture' | 'expression';

/**
 * Uploads an image for any entity type
 * @param imageFile - Image file to upload
 * @param entityType - Entity type (word, lecture, expression)
 * @param entityId - Entity ID
 * @returns Promise with server response
 */
export const uploadImage = async (
  imageFile: File,
  entityType: EntityType,
  entityId: string
): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('imageFile', imageFile);

    const endpoint = `/api/upload-image/${entityType}/${entityId}`;
    
    const response = await api.post<UploadImageResponse>(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

/**
 * Uploads image for a specific word
 * @param imageFile - Image file
 * @param wordId - Word ID
 */
export const uploadWordImage = async (imageFile: File, wordId: string): Promise<UploadImageResponse> => {
  return uploadImage(imageFile, 'word', wordId);
};

/**
 * Uploads image for a specific lecture
 * @param imageFile - Image file
 * @param lectureId - Lecture ID
 */
export const uploadLectureImage = async (imageFile: File, lectureId: string): Promise<UploadImageResponse> => {
  return uploadImage(imageFile, 'lecture', lectureId);
};

/**
 * Uploads image for a specific expression
 * @param imageFile - Image file
 * @param expressionId - Expression ID
 */
export const uploadExpressionImage = async (imageFile: File, expressionId: string): Promise<UploadImageResponse> => {
  return uploadImage(imageFile, 'expression', expressionId);
};
