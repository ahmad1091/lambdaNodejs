import { getAllGallery, getByMeta } from '../model';

export const getAll = async async => {
  const data = await getAllGallery();
  return data;
};

export const getByName = async params => {
  const { location, description } = params;
  const data = await getByMeta(location, description);
  return data;
};
