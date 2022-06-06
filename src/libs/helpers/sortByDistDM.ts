export const sortByDistDM = (a: { location: any }, b: { location: any }) => {
  return a.location?.distance?.value - b.location?.distance?.value;
};
