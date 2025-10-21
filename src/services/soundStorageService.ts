import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';

const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_FORMATS = ['audio/wav', 'audio/x-wav', 'audio/wave'];
const STORAGE_PATH = 'notification-sounds';

function getStorageInstance() {
  const apps = getApps();
  if (apps.length === 0) {
    throw new Error('Firebase app not initialized');
  }
  return getStorage(apps[0]);
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateSoundFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  if (!ALLOWED_FORMATS.includes(file.type) && !file.name.toLowerCase().endsWith('.wav')) {
    return {
      isValid: false,
      error: 'Only WAV audio files are allowed'
    };
  }

  return { isValid: true };
}

export async function uploadSoundFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const validation = validateSoundFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const storage = getStorageInstance();
  const timestamp = Date.now();
  const fileName = `sound_${timestamp}.wav`;
  const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

export async function deleteOldSoundFiles(currentFileUrl?: string): Promise<void> {
  try {
    const storage = getStorageInstance();
    const listRef = ref(storage, STORAGE_PATH);
    const fileList = await listAll(listRef);

    const deletePromises = fileList.items
      .filter(itemRef => {
        if (!currentFileUrl) return true;
        return !currentFileUrl.includes(itemRef.name);
      })
      .map(itemRef => deleteObject(itemRef).catch(err => {
        console.warn(`Failed to delete ${itemRef.name}:`, err);
      }));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error cleaning up old sound files:', error);
  }
}

export async function getSoundFileUrl(fileName: string): Promise<string> {
  const storage = getStorageInstance();
  const storageRef = ref(storage, `${STORAGE_PATH}/${fileName}`);
  return await getDownloadURL(storageRef);
}
