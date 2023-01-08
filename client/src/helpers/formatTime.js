export const timeInRange = (time, sStartTime, sEndTime) => {
  const aTime = time.split(":");
  const aHTime = parseInt(aTime[0]);
  if (aHTime === sStartTime || aHTime === sEndTime) {
    return true;
  }
};
