import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MapView, Camera, ShapeSource, RasterLayer, RasterSource, LineLayer } from "@maplibre/maplibre-react-native";
import axios from 'axios';
import { LeafletView, MapShapeType } from 'react-native-leaflet-view';
import Geolocation from '@react-native-community/geolocation';
const OsmMap = ({
    initialRegion = {
        latitude: 25.276987, // default to Dubai
        longitude: 55.296249,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    },
    markers = [],
}) => {
    // const coordinates = [51.520008, 25.276987];
    // const geoJSON = {
    //     type: 'FeatureCollection',
    //     features: [
    //         {
    //             type: 'Feature',
    //             geometry: {
    //                 type: 'Point',
    //                 coordinates: coordinates,
    //             },
    //             properties: {
    //                 icon: 'marker',
    //             },
    //         },
    //     ],
    // };

    // const start = [51.520008, 25.276987]; // Qatar
    // const end = [46.7128, 24.7743]; // Downtown Riyadh (adjusted)

    // const [route, setRoute] = useState(null);
    // const [mapLayers, setMapLayers] = useState([]);

    // useEffect(() => {
    //     const getRoute = async () => {
    //         const geojson = await fetchRoute(start, end);
    //         if (geojson) setRoute(geojson);
    //     };

    //     getRoute();
    // }, []);
    // const apiKey = '5b3ce3597851110001cf6248deee8cf1a4934bd6b46d392b376ec74d';

    // const fetchRoute = async (startCoords, endCoords) => {
    //     const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

    //     const body = {
    //         coordinates: [startCoords, endCoords]
    //     };

    //     try {
    //         const response = await axios.post(url, body, {
    //             headers: {
    //                 'Authorization': `${apiKey}`,
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    //             }
    //         });
    //         console.log("responseresponse", response.data);
    //         const geo = response.data.features[0].geometry.coordinates;
    //         const leafletCoords = geo.map(([lng, lat]) => ({ lat, lng }));
    //         setMapLayers(leafletCoords);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error('ORS Error:', error.response?.data || error.message);
    //         } else {
    //             console.error('Error:', error);
    //         }
    //         return null;
    //     }
    // };
    // console.log("mapLayersmapLayers", mapLayers);
    // return (
    //     <View style={styles.container}>
    //         <LeafletView
    //             androidHardwareAccelerationDisabled={false}
    //             mapCenterPosition={{ lat: 25.276987, lng: 51.520008 }} // Qatar
    //             zoom={10}
    //             mapLayers={[
    //                 {
    //                     url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    //                     attribution: '© OpenStreetMap contributors',
    //                 },
    //             ]}
    //             mapMarkers={[
    //                 {
    //                     position: { lat: 25.276987, lng: 51.520008 },
    //                     icon: Image.resolveAssetSource(require('../assets/images/Marker/Marker6.png')).uri,
    //                     size: [32, 32],
    //                     title: 'Qatar',
    //                 },
    //                 {
    //                     position: { lat: 24.7743, lng: 46.7128 }, // Riyadh
    //                     icon: Image.resolveAssetSource(require('../assets/images/Marker/Marker6.png')).uri,
    //                     size: [32, 32],
    //                     title: 'Riyadh',
    //                 },
    //             ]}

    //             mapShapes={[
    //                 {
    //                     id: 'route-line',
    //                     shapeType: MapShapeType.POLYLINE,
    //                     positions: mapLayers, // ← converted from API response
    //                     color: 'blue',
    //                 },
    //             ]}
    //         />
    //     </View>
    // )

    const [polyline, setPolyline] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [placeNames, setPlaceNames] = useState({ start: '', end: '' });
    const [currentLocation, setCurrentLocation] = useState({})

    const startCoords = [51.520008, 25.276987]; // Qatar
    const endCoords = [46.7128, 24.7743];



    useEffect(() => {
        fetchRoute();
        fetchPlaceNames();
    }, []);

    const ORS_API_KEY = '5b3ce3597851110001cf6248deee8cf1a4934bd6b46d392b376ec74d'
    const fetchPlaceNames = async () => {
        const reverseGeocode = async ([lng, lat]) => {
            try {
                const res = await axios.get(`https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lat=${lat}&point.lon=${lng}`);
                console.log("resresresres_____", res.data);

                return res.data.features[0]?.properties?.label || 'Unknown';
            } catch {
                return 'Unknown';
            }
        };

        const start = await reverseGeocode(startCoords);
        const end = await reverseGeocode(endCoords);
        setPlaceNames({ start, end });
    };

    const fetchRoute = async () => {
        try {
            const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
            const body = { coordinates: [startCoords, endCoords] };
            const res = await axios.post(url, body, {
                headers: {
                    Authorization: ORS_API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            const geoCoords = res.data.features[0].geometry.coordinates;
            const positions = geoCoords.map(([lng, lat]) => ({ lat, lng }));

            setPolyline(positions);

            const summary = res.data.features[0].properties.summary;
            setRouteInfo({
                distance: (summary.distance / 1000).toFixed(2) + ' km',
                duration: (summary.duration / 60).toFixed(1) + ' min',
            });
        } catch (error) {
            console.error('Route fetch error:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LeafletView
                androidHardwareAccelerationDisabled={false}
                mapCenterPosition={{ lat: 25.276987, lng: 51.520008 }}
                zoom={5}
                mapLayers={[{
                    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attribution: '© OpenStreetMap contributors',
                }]}
                mapMarkers={[
                    {
                        position: { lat: /* 25.276987 */startCoords[1], lng: /* 51.520008 */ startCoords[0] },
                        icon: Image.resolveAssetSource(require('../assets/images/Marker/Marker6.png')).uri,
                        size: [32, 32],
                        title: 'Start'
                    },
                    {
                        position: { lat: /* 24.7743 */endCoords[1], lng: /* 46.7128 */endCoords[0] },
                        icon: Image.resolveAssetSource(require('../assets/images/Marker/Marker6.png')).uri,
                        size: [32, 32],
                        title: 'End'
                    }
                ]}
                mapShapes={[
                    {
                        id: 'route-line',
                        shapeType: MapShapeType.POLYLINE,
                        positions: polyline,
                        color: 'blue',
                    }
                ]}

            />

            {routeInfo && (
                <View style={styles.card}>
                    <Text style={styles.label}>🗺 From: {placeNames.start}</Text>
                    <Text style={styles.label}>🏁 To: {placeNames.end}</Text>
                    <Text style={styles.value}>📏 Distance: {routeInfo.distance}</Text>
                    <Text style={styles.value}>⏱ Duration: {routeInfo.duration}</Text>
                </View>
            )}
        </View>
    );
};

export default OsmMap;

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },
// });

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    label: { fontWeight: '600', fontSize: 16 },
    value: { marginTop: 4, fontSize: 15 },
});
