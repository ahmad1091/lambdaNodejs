export const all = () => {
  return `select  image_location as imageLocation, imageUrl, description , last_update as lastUpdate from PARAM.GALLERY;`;
};

export const byLocationAndDesc = () => {
  return `select imageUrl from PARAM.GALLERY where image_location =:image_location and description=:description;`;
};
