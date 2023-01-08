export const timeInRange = (time, timeStart, timeEnd) => {
  // time - 7 , timeStart - 7 timeEnd 8
  const t = parseInt(time.split(":")[0]);
  if (t === timeStart || t === timeEnd) {
    return true;
  } else if (timeStart <= t && timeEnd >= t) {
    return true;
  }
};
