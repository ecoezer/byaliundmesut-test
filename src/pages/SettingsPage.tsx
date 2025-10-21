import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Volume2, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { uploadSoundFile, validateSoundFile, deleteOldSoundFiles } from '../services/soundStorageService';
import { saveActiveSoundSettings, getActiveSoundSettings, clearActiveSoundSettings } from '../services/soundSettingsService';
import type { SoundSettings } from '../services/soundSettingsService';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentSound, setCurrentSound] = useState<SoundSettings | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadCurrentSound();
  }, []);

  const loadCurrentSound = async () => {
    try {
      setLoading(true);
      const settings = await getActiveSoundSettings();
      setCurrentSound(settings);
    } catch (error) {
      console.error('Error loading sound settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateSoundFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setErrorMessage(null);
      setSuccessMessage(null);

      const downloadURL = await uploadSoundFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      await saveActiveSoundSettings(downloadURL, selectedFile.name);

      if (currentSound?.soundFileURL) {
        await deleteOldSoundFiles(downloadURL);
      }

      await loadCurrentSound();

      setSuccessMessage('Sound uploaded successfully and set as active!');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading sound:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload sound');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('Reset to default notification sound?')) return;

    try {
      setUploading(true);
      await clearActiveSoundSettings();

      if (currentSound?.soundFileURL) {
        await deleteOldSoundFiles();
      }

      await loadCurrentSound();
      setSuccessMessage('Reset to default sound successfully!');
    } catch (error) {
      console.error('Error resetting sound:', error);
      setErrorMessage('Failed to reset to default sound');
    } finally {
      setUploading(false);
    }
  };

  const handleTestSound = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
    }

    const soundUrl = currentSound?.soundFileURL || '/notification.mp3';
    const audio = new Audio(soundUrl);
    audio.volume = 0.7;
    audioPreviewRef.current = audio;
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
      setErrorMessage('Failed to play sound');
    });
  };

  const handleTestSelectedFile = () => {
    if (!selectedFile) return;

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
    }

    const url = URL.createObjectURL(selectedFile);
    const audio = new Audio(url);
    audio.volume = 0.7;
    audioPreviewRef.current = audio;
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
      setErrorMessage('Failed to play sound');
    });
  };

  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <header className="bg-[#1a2332] border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
              <p className="text-gray-400 text-sm">Manage notification sound preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        <div className="bg-[#2a3648] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Current Notification Sound</h2>
            <button
              onClick={handleTestSound}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Test Current Sound
            </button>
          </div>

          <div className="bg-[#1e2836] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">File Name</p>
                <p className="text-white font-medium">
                  {currentSound?.fileName || 'notification.mp3 (Default)'}
                </p>
              </div>
              {currentSound?.uploadedAt && (
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Uploaded</p>
                  <p className="text-white text-sm">
                    {currentSound.uploadedAt.toLocaleDateString()} {currentSound.uploadedAt.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>

            {currentSound?.soundFileURL && (
              <button
                onClick={handleResetToDefault}
                disabled={uploading}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Reset to Default Sound
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#2a3648] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upload Custom Sound</h2>
          <p className="text-gray-400 text-sm mb-6">
            Upload a WAV audio file (max 1MB) to use as your order notification sound
          </p>

          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,audio/wav,audio/x-wav,audio/wave"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
                id="sound-upload"
              />
              <label
                htmlFor="sound-upload"
                className={`flex items-center justify-center gap-3 w-full px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  uploading
                    ? 'border-gray-600 bg-gray-700/50 cursor-not-allowed'
                    : 'border-gray-600 hover:border-orange-500 hover:bg-[#1e2836]'
                }`}
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-gray-300">
                  {selectedFile ? selectedFile.name : 'Click to select WAV file'}
                </span>
              </label>
            </div>

            {selectedFile && (
              <div className="bg-[#1e2836] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Selected File</p>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={handleTestSelectedFile}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Preview
                  </button>
                </div>

                {uploading && (
                  <div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 text-center">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload and Activate
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Requirements</h3>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li>File format: WAV only</li>
              <li>Maximum file size: 1MB</li>
              <li>The uploaded sound will automatically become the active notification sound</li>
              <li>Previous custom sounds will be deleted to save storage space</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
