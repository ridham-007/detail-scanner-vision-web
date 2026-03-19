const DEVICE_ID_KEY = "device_id";

export const getDeviceId = (): string => {
  try {
    if (typeof window === "undefined") {
      return "";
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
      console.log("Generated new Device ID:", deviceId); // ✅
    } else {
      console.log("Existing Device ID:", deviceId); // ✅
    }

    return deviceId;
  } catch (error) {
    console.error("Error getting device ID:", error);

    const fallback = crypto.randomUUID();
    console.log("Fallback Device ID:", fallback); // ✅
    return fallback;
  }
};
