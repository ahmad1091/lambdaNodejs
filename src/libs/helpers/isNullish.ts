export const isNull = val => {
  return (
    String(val) == 'null' || String(val) == 'undefined' || String(val) == ''
  );
};
