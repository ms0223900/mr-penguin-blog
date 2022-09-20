const getCurrentPostHeaderLevel = (currentMinLevel: number, level: number) =>
  Math.abs(currentMinLevel - level);

export default getCurrentPostHeaderLevel;
