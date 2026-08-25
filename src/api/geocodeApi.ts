export interface GeocodeResult {
  lat: number;
  lng: number;
}

// Nominatim (OpenStreetMap) search — matches the map embed already used in
// CustomerRegistrationModal, no API key needed for low-volume lookups.
export async function searchAddress(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo buscar la dirección');
  }

  const results: Array<{ lat: string; lon: string }> = await response.json();
  if (results.length === 0) return null;

  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}
