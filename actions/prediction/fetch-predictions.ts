"use server";
export const fetchPredictions = async (titles: string[]) => {
  const response = await fetch("https://api.mezoo.me/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titles })
  });
  const data = await response.json();

  let status;
  if (data.predictions[0] > 75) {
    status = "EXTREME GREED";
  } else if (data.predictions[0] > 55) {
    status = "GREED";
  } else if (data.predictions[0] > 45) {
    status = "NEUTRAL";
  } else if (data.predictions[0] > 25) {
    status = "FEAR";
  } else {
    status = "EXTREME FEAR";
  }
  return { result: data.predictions[0], status: status };
};