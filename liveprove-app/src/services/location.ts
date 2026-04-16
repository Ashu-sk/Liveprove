import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const location = await Location.getCurrentPositionAsync({});
  const geocode = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  const place = geocode[0];
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    city: place?.city || place?.district || 'Unknown',
    state: place?.region || 'Unknown',
    country: place?.isoCountryCode || 'IN',
    location_name: `${place?.city || place?.district}, ${place?.region}`,
  };
}

// Back-compat for existing screens (do not remove)
export async function getCurrentCityName(): Promise<string | null> {
  const loc = await getCurrentLocation();
  return loc?.city ?? null;
}

