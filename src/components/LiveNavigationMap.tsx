import React, { useEffect, useRef, useState } from 'react';
import { Camera, LineLayer, MapView, MarkerView, PointAnnotation, ShapeSource, SymbolLayer, UserLocation, UserTrackingMode, VectorSource } from '@maplibre/maplibre-react-native';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Pressable, FlatList, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const ORS_API_KEY = '5b3ce3597851110001cf6248a80e36938bc24bcd8a2b8c67bd29926d';
// const ORS_API_KEY = '5b3ce3597851110001cf6248deee8cf1a4934bd6b46d392b376ec74d';

const DESTINATION = {
  lat: 8.8932,
  lon: 76.6141,
};

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [liveLocation, setLiveLocation] = useState<[number, number] | null>(null);
  const [wayPoints, setWayPoints] = useState();

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [shouldFollowUser, setShouldFollowUser] = useState(true);
  const cameraRef = useRef<Camera>(null);
  const [loading, setLoading] = useState(false);

  console.log("shouldFollowUser=>", shouldFollowUser);
  

  const carEndPoint = 'driving-car';
  const wheelchairEndPoint = 'wheelchair';

  const [activeState, setActiveState] = useState(carEndPoint)

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {

    if (userLocation) {
      // setLoading(true)
      fetchRoute(userLocation, [DESTINATION.lon, DESTINATION.lat]);
      // startWatchingLocation();
    }
  }, [userLocation, activeState]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
    // getCurrentLocation();
  };

  // const getCurrentLocation = () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       pos => {
  //         const { latitude, longitude } = pos.coords;
  //         // console.log("pos.coords=>", pos.coords);

  //         // setUserLocation([Number(longitude.toFixed(5)), Number(latitude.toFixed(5))]);
  //       },
  //       err => console.error(err),
  //       { enableHighAccuracy: true, timeout: 15000 }
  //     );
  //   } catch (error) {
  //     console.log('error__', error);
  //   }

  // };

  const startWatchingLocation = () => {
    Geolocation.watchPosition(
      position => {
        const newCoord: [number, number] = [position.coords.longitude, position.coords.latitude];
        const heading = position.coords.heading || 0;
        setLiveLocation(newCoord);
        // console.log("newCoordnewCoord", newCoord);

        moveCamera(newCoord, heading);
      },
      error => console.log('watch error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 2000,
        fastestInterval: 1000,
      }
    );
  };

  const moveCamera = (coord: [number, number], heading: number) => {
    setShouldFollowUser(true);
    // if (userLocation && cameraRef.current) {
    //   cameraRef.current?.setCamera({
    //     centerCoordinate: coord,
    //     zoomLevel: 17,
    //     animationDuration: 1000,
    //   });
    // }
  };

  const fetchRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/${activeState}/geojson`;
      // const url = 'https://api.openrouteservice.org/v2/directions/wheelchair/geojson';
      // const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
      const body = { coordinates: [start, end] };

      const response = await axios.post(url, body, {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      // if (response) {
      //   setLoading(false)
      // }

      const coords = response.data.features[0].geometry.coordinates;

      const steps = response.data.features[0].properties.segments[0].steps;
      const stepInstructions = steps.map((step: any) => step.instruction);

      setWayPoints(response.data.features[0].properties.segments[0].steps);
      setRouteCoords(coords);
      setInstructions(stepInstructions);
    } catch (error) {
      // setLoading(false)
      console.error('Route error:', JSON.stringify(error));
    }
  };
  // console.log("cameraRef.curren=>", cameraRef.current);

  // const reEnableFollow = () => {
  //   cameraRef.current?.setCamera({
  //     followUserLocation: true,
  //     followUserMode: 'normal',
  //     animationDuration: 500,
  //   });
  // };
  const handleRegionChange = () => {
    setShouldFollowUser(false);
    // if (properties?.isUserInteraction) {
    //   console.log("yesss");

    //   // User has manually moved/zoomed/rotated the map
    //   setShouldFollowUser(false);

    //   // Re-enable follow mode after 5 seconds (or after a button press)
    //   setTimeout(() => {
    //     setShouldFollowUser(true);
    //   }, 5000);
    // }
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          logoEnabled={false}
          compassEnabled={true}
          rotateEnabled={true}
          mapStyle={require('../components/OsmJson.json')}
          onRegionDidChange={() => handleRegionChange()}
          // onRegionDidChange={(e) => handleRegionChange(e)}
        // onRegionDidChange={handleRegionChange}
        >
          <UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            renderMode="native"
            animated={true}
            minDisplacement={1}
            androidRenderMode="compass"
            onUpdate={(pos) => {
              const { latitude, longitude } = pos.coords;
              setUserLocation([Number(longitude.toFixed(5)), Number(latitude.toFixed(5))]);
            }}
          />
          {userLocation && (
            <Camera
              ref={cameraRef}
              centerCoordinate={userLocation}
              zoomLevel={17.5}
              animationMode="flyTo"
              animationDuration={1000}
              followUserLocation={shouldFollowUser}
              followUserMode={UserTrackingMode.FollowWithCourse}
              // followUserMode={UserTrackingMode.FollowWithHeading}  // The map will rotate based on the direction the user is facing
              heading={10}
            />
          )}
          {userLocation && (
            <PointAnnotation id="user-location" coordinate={userLocation}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'blue', borderColor: '#fff', borderWidth: 2 }} />
            </PointAnnotation>
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
                style={{
                  lineColor: '#007AFF',
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            </ShapeSource>
          )}
          {userLocation && routeCoords.length > 0 && (
            <ShapeSource id="connectorSource" shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [userLocation, routeCoords[0]],
              },
            }}>
              <LineLayer
                id="connectorLine"
                style={{
                  lineColor: '#007AFF50',
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                  lineDasharray: [2, 2],
                }}
              />
            </ShapeSource>
          )}
          {DESTINATION && routeCoords.length > 0 && (
            <ShapeSource id="connectorSource2" shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[DESTINATION.lon, DESTINATION.lat], routeCoords[routeCoords.length - 1]],
              },
            }}>
              <LineLayer
                id="connectorLine2"
                style={{
                  lineColor: '#007AFF50',
                  lineWidth: 4,
                  lineCap: 'round',
                  lineJoin: 'round',
                  lineDasharray: [2, 2],
                }}
              />
            </ShapeSource>
          )}

          <PointAnnotation id="destination" coordinate={[DESTINATION.lon, DESTINATION.lat]} >
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'blue', borderColor: '#fff', borderWidth: 2 }} />
          </PointAnnotation>
        </MapView>

        <View style={styles.instructions}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', margin: 10 }}>
              <Pressable onPress={() => setActiveState(wheelchairEndPoint)} style={{ backgroundColor: activeState == wheelchairEndPoint ? '#f78f63' : '#FFF', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 20, marginRight: 10 }}>
                <Text>Wheelchair</Text>
              </Pressable>
              <Pressable onPress={() => setActiveState(carEndPoint)} style={{ backgroundColor: activeState == carEndPoint ? '#f78f63' : '#FFF', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 20 }}>
                <Text>Car</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => moveCamera(userLocation)} style={{ backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 20, marginRight: 10, alignSelf: 'center' }}>
              <Text>Recenter</Text>
            </Pressable>
          </View>
          <View style={{ backgroundColor: '#fff', padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 110, paddingBottom: 45 }}>
            <Text style={styles.title}>
              {wayPoints?.[0]?.distance > 0 ? `After ${wayPoints?.[0].distance.toFixed(0)} meters ` : ''}{wayPoints?.[0]?.instruction}
            </Text>
          </View>
        </View>
      </View>
      {/* {loading && (
        <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, backgroundColor: '#00000040' }}>
          <ActivityIndicator size={'large'} />
        </View>
      )} */}
    </>
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
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  step: { fontSize: 14, marginBottom: 2 },
});
