import { create } from "zustand";

const useLocationStore = create((set) => ({
  location: {
    latitude: null,
    longitude: null,
    address: "",
    additionalInfo: {
      village: "",
      county: "",
      state: "",
      country: "",
    },
  },
  ip: null,
  locationError: null,
  locationPermission: false,
  setLocation: (location) =>
    set((state) => ({
      location: { ...state.location, ...location },
    })),
  setIp: (ip) => set({ ip }),
  setLocationError: (error) => set({ locationError: error }),
  setLocationPermission: (permission) =>
    set({ locationPermission: permission }),
}));

export default useLocationStore;
