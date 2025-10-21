import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, ensureFirebaseInitialized } from '../lib/firebase';

const SETTINGS_COLLECTION = 'sound_settings';
const ACTIVE_SOUND_DOC_ID = 'active_sound';

export interface SoundSettings {
  soundFileURL: string;
  fileName: string;
  uploadedAt: Date;
  isActive: boolean;
}

export async function saveActiveSoundSettings(soundFileURL: string, fileName: string): Promise<void> {
  ensureFirebaseInitialized();
  if (!db) throw new Error('Firestore not initialized');

  const settingsRef = doc(db, SETTINGS_COLLECTION, ACTIVE_SOUND_DOC_ID);

  await setDoc(settingsRef, {
    soundFileURL,
    fileName,
    uploadedAt: serverTimestamp(),
    isActive: true
  });
}

export async function getActiveSoundSettings(): Promise<SoundSettings | null> {
  ensureFirebaseInitialized();
  if (!db) throw new Error('Firestore not initialized');

  const settingsRef = doc(db, SETTINGS_COLLECTION, ACTIVE_SOUND_DOC_ID);
  const settingsSnap = await getDoc(settingsRef);

  if (!settingsSnap.exists()) {
    return null;
  }

  const data = settingsSnap.data();
  return {
    soundFileURL: data.soundFileURL,
    fileName: data.fileName,
    uploadedAt: data.uploadedAt?.toDate() || new Date(),
    isActive: data.isActive ?? true
  };
}

export async function clearActiveSoundSettings(): Promise<void> {
  ensureFirebaseInitialized();
  if (!db) throw new Error('Firestore not initialized');

  const settingsRef = doc(db, SETTINGS_COLLECTION, ACTIVE_SOUND_DOC_ID);

  await setDoc(settingsRef, {
    soundFileURL: '',
    fileName: 'default',
    uploadedAt: serverTimestamp(),
    isActive: false
  });
}
