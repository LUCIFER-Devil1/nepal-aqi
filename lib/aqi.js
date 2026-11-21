export function aqiCategory(aqi) {
  if (aqi == null) return { label: "No data", color: "#9ca3af" };
  if (aqi <= 50)  return { label: "Good", color: "#00e400" };
  if (aqi <= 100) return { label: "Moderate", color: "#e6c800" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "#ff7e00" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#ff0000" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#8f3f97" };
  return { label: "Hazardous", color: "#7e0023" };
}

export function aqiAdvice(aqi) {
  if (aqi == null) return "No data available.";
  if (aqi <= 50) return "Air quality is good. Enjoy outdoor activities.";
  if (aqi <= 100) return "Acceptable. Unusually sensitive people should consider limiting long outdoor exertion.";
  if (aqi <= 150) return "Children, older adults, and people with heart or lung conditions should reduce prolonged outdoor exertion.";
  if (aqi <= 200) return "Everyone may begin to feel effects. Limit outdoor exertion and consider a mask (N95/KN95) outdoors.";
  if (aqi <= 300) return "Health alert. Avoid outdoor activity and keep windows closed.";
  return "Emergency conditions. Stay indoors and avoid all outdoor exertion.";
}

export const AQI_LEVELS = [
  {
    max: 50, label: "Good", color: "#00e400", range: "0-50",
    measures: [
      "Enjoy outdoor activities and exercise.",
      "Open windows to ventilate your home.",
      "Check the AQI again before big outdoor events, since it can change quickly.",
    ],
  },
  {
    max: 100, label: "Moderate", color: "#e6c800", range: "51-100",
    measures: [
      "Most people can go about normal activities.",
      "People unusually sensitive to pollution should watch for cough or shortness of breath and reduce long, hard outdoor exertion.",
      "People with asthma should keep their inhaler or medicine within reach.",
    ],
  },
  {
    max: 150, label: "Unhealthy for Sensitive Groups", color: "#ff7e00", range: "101-150",
    measures: [
      "Children, older adults, pregnant women, and people with heart or lung disease should limit prolonged outdoor activity.",
      "Move exercise indoors, or do it when traffic is low.",
      "Wear an N95/KN95 mask if you must spend a long time outside.",
      "Avoid busy roads and keep windows closed near traffic.",
    ],
  },
  {
    max: 200, label: "Unhealthy", color: "#ff0000", range: "151-200",
    measures: [
      "Everyone should reduce outdoor activity, and avoid exercising outside.",
      "Wear an N95/KN95 mask outdoors. Cloth and surgical masks don't filter fine particles well.",
      "Keep windows and doors closed. Use an air purifier with a HEPA filter if you have one.",
      "Don't burn garbage, wood, or incense indoors. Mop damp instead of sweeping dust.",
      "Schools should move sports and assemblies indoors.",
    ],
  },
  {
    max: 300, label: "Very Unhealthy", color: "#8f3f97", range: "201-300",
    measures: [
      "Stay indoors and avoid all outdoor exertion.",
      "Run an air purifier and keep windows sealed. Choose a room with fewer gaps.",
      "If you must go out, wear a well-fitted N95/KN95 and keep the trip short.",
      "Sensitive groups should keep medicines ready and avoid going out entirely.",
      "Seek medical care for chest pain, wheezing, or trouble breathing.",
    ],
  },
  {
    max: Infinity, label: "Hazardous", color: "#7e0023", range: "301+",
    measures: [
      "Stay indoors. Postpone travel and outdoor work where possible.",
      "Seal gaps around doors and windows, and run a purifier continuously.",
      "Only go out for essential reasons, wearing a well-fitted N95/KN95.",
      "Check on older neighbors, young children, and anyone with lung or heart conditions.",
      "Get medical help quickly for severe breathing difficulty, chest pain, or dizziness.",
    ],
  },
];

export function aqiLevel(aqi) {
  if (aqi == null) return null;
  return AQI_LEVELS.find((l) => aqi <= l.max);
}

export function aqiMeasures(aqi) {
  return aqiLevel(aqi)?.measures ?? [];
}