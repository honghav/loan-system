export const useDeviceId = () => {
  const key = "device_id";

  const getDeviceId = () => {
    let id = localStorage.getItem(key);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }

    return id;
  };

  return { getDeviceId };
};
