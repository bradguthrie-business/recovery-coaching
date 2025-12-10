import { API_GATEWAY_URL } from "../aws/config";

const ensureApiUrl = () => {
  if (!API_GATEWAY_URL) {
    console.warn("API Gateway URL not configured. Calls will fail.");
  }
};

const post = async (path, payload = {}) => {
  ensureApiUrl();
  if (!API_GATEWAY_URL) {
    throw new Error("API Gateway URL not configured");
  }

  const url = API_GATEWAY_URL.endsWith("/")
    ? `${API_GATEWAY_URL.slice(0, -1)}${
        path.startsWith("/") ? path : `/${path}`
      }`
    : `${API_GATEWAY_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json();
};

// User
export const saveUserRecoveryPath = (data) =>
  post("/saveUserRecoveryPath", data);
export const getUserData = (data) => post("/getUserData", data);
export const getUserStats = (data) => post("/getUserStats", data);

// Recovery Tracking / Recovery Counters
export const getRecoveryCounters = (data) => post("/getRecoveryCounters", data);
export const saveRecoveryCounters = (data) =>
  post("/saveRecoveryCounters", data);

// Journal
export const getJournalEntries = (data) => post("/getJournalEntries", data);
export const saveJournalEntry = (data) => post("/saveJournalEntry", data);

// Step Work
export const getStepWork = (data) => post("/getStepWork", data);
export const saveStepWork = (data) => post("/saveStepWork", data);

// Focus
export const getTodaysFocus = (data) => post("/getTodaysFocus", data);
