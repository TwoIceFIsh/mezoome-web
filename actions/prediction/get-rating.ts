export const getRating = (average: number): string => {
  if (average > 75) return "EXTREME GREED";
  if (average > 55) return "GREED";
  if (average > 45) return "NEUTRAL";
  if (average > 25) return "FEAR";
  return "EXTREME FEAR";
};