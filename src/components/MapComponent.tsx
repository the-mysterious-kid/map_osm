import React, { useEffect, useRef, useState } from 'react';
import { Camera, LineLayer, MapView, PointAnnotation, ShapeSource } from '@maplibre/maplibre-react-native';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import polyline from '@mapbox/polyline'; // Decode polyline
import axios from 'axios';

const ORS_API_KEY = '5b3ce3597851110001cf6248deee8cf1a4934bd6b46d392b376ec74d';

const DESTINATION = {
  lat: 8.8932, // Example: Dubai
  lon: 76.6141,
};

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
    getCurrentLocation();
  }, []);
  console.log("userLocation", userLocation);

  useEffect(() => {
    if (userLocation) fetchRoute(userLocation, [DESTINATION.lon, DESTINATION.lat]);
  }, [userLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
      },
      error => console.error(error),
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
      const body = { coordinates: [start, end] };
      const response = await axios.post(url, body, {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      const coords = response.data.features[0].geometry.coordinates;
      const steps = response.data.features[0].properties.segments[0].steps;

      const stepInstructions = steps.map((step: any) => step.instruction);
      setRouteCoords(coords);
      setInstructions(stepInstructions);
    } catch (error) {
      console.error('Route error:', JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        mapStyle={require('../components/OsmJson.json')}
      >
        <Camera
          ref={cameraRef}
          centerCoordinate={userLocation || [0, 0]}
          zoomLevel={14}
        />
        {userLocation && (
          <PointAnnotation id="user-location" coordinate={userLocation} />
        )}
        {routeCoords.length > 0 && (
          <ShapeSource id="routeSource" shape={{
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: routeCoords,
            },
          }}>
            <LineLayer
              id="routeLine"
              style={{ lineColor: 'blue', lineWidth: 4 }}
            />
          </ShapeSource>
        )}
        <PointAnnotation id="destination" coordinate={[DESTINATION.lon, DESTINATION.lat]} />
      </MapView>

      <View style={styles.instructions}>
        <Text style={styles.title}>Directions</Text>
        {instructions.slice(0, 5).map((step, index) => (
          <Text key={index} style={styles.step}>• {step}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  instructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  step: { fontSize: 14, marginBottom: 2 },
});
