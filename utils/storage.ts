import * as FileSystem from 'expo-file-system';

export const STORAGE_PATHS = {
  ENTRENAMIENTOS: FileSystem.documentDirectory + 'data/entrenamientos.json',
  METAS: FileSystem.documentDirectory + 'data/metas.json',
};

export const ensureDirectoryExists = async () => {
  const dataDir = FileSystem.documentDirectory + 'data/';
  const dirInfo = await FileSystem.getInfoAsync(dataDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
  }
};