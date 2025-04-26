/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Asynchronously retrieves the latitude and longitude for a given city.
 *
 * @param city The city for which to retrieve coordinates.
 * @returns A promise that resolves to a Location object containing coordinates.
 */
export async function getCoordinates(city: string): Promise<Location> {
  // TODO: Implement this by calling an API.

  return {
    lat: 34.0522,
    lng: -118.2437,
  };
}
