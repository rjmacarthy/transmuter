export const getTransmuter = async () => {
  const module = await import("../pkg");
  return module;
};
