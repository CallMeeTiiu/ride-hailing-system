export async function fetchRoute(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
): Promise<any | null> {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/` +
            `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
            `?geometries=geojson&overview=full`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]) {
            return {
                type: 'Feature',
                geometry: data.routes[0].geometry,
            };
        }
    } catch (error) {
        console.error('Error fetching route from OSRM:', error);
    }
    return null;
}
