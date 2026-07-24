export const useMapPicker = () => {
  const isMapPickerOpen = useState("map-picker", () => false);

  const openMapPicker = () => {
    isMapPickerOpen.value = true;
  };

  const closeMapPicker = () => {
    isMapPickerOpen.value = false;
  };

  const toggleMapPicker = () => {
    isMapPickerOpen.value = !isMapPickerOpen.value;
  };

  return {
    isMapPickerOpen,
    openMapPicker,
    closeMapPicker,
    toggleMapPicker,
  };
};
