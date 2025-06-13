import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraRef, LineLayer, MapView, MarkerView, PointAnnotation, ShapeSource, SymbolLayer, UserLocation, UserTrackingMode, VectorSource } from '@maplibre/maplibre-react-native';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Pressable, FlatList, ActivityIndicator, Dimensions, Image, TextInput, Keyboard } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import { favouriteIcon, HamBurger, loveIcon, loveIcon2, MicroPhone } from '../assets/images';
import isEmpty from 'lodash/isEmpty'

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
  const cameraRef = useRef<CameraRef>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [locationSuggestion, setLocationSuggestion] = useState({})
  const [searchLocation, setSearchLocation] = useState([])

  const [pathCoordinates, setPathCoordinates] = useState([])
  const [locationOnPress, setLocationOnPress] = useState([])
  const [coordinateDetails, setCoordinateDetails] = useState([])




  const carEndPoint = 'driving-car';
  const wheelchairEndPoint = 'wheelchair';

  const [activeState, setActiveState] = useState(carEndPoint)

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {

    if (userLocation) {
      // setLoading(true)
      // fetchRoute(userLocation, [DESTINATION.lon, DESTINATION.lat]);
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
      const url = `https://api.openrouteservice.org/v2/directions/${activeState ? activeState : 'driving-car'}/geojson`;
      // const url = 'https://api.openrouteservice.org/v2/directions/wheelchair/geojson';
      // const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
      const body = { coordinates: [start, end] };
      console.log("body=>", body);
      setLoading(true)
      setPathCoordinates([start, end])
      const response = await axios.post(url, body, {
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      console.log("response=>", response);
      if (response.data) {
        const coords = response.data.features[0].geometry.coordinates;

        const steps = response.data.features[0].properties.segments[0].steps;
        const stepInstructions = steps.map((step: any) => step.instruction);

        setWayPoints(response.data.features[0].properties.segments[0].steps);
        setRouteCoords(coords);
        setInstructions(stepInstructions);
        setLoading(false)
      }

      // if (response) {
      //   setLoading(false)
      // }


    } catch (error) {
      setLoading(false)
      // setLoading(false)
      console.error('Route error:', JSON.stringify(error));
    }
  };

  const handleRegionChange = () => {
    setShouldFollowUser(false);
  };
  const WIDTH = Dimensions.get('window').width
  const HEIGHT = Dimensions.get('window').height


  const fetchLocationDetails = async (cordinates: [number, number]) => {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lat=${cordinates[1]}&point.lon=${cordinates[0]}&size=1`
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      });
      console.log("response__0000000", JSON.stringify(response?.data));
      setCoordinateDetails(response?.data)

    } catch (error) {
      console.log("searchError", error);
    }

  }

  const handleSuggestionSearch = async () => {
    const url = `https://photon.komoot.io/api/?q=${searchTerm}&limit=10`
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        }
      });
      // console.log("response__111", JSON.stringify(response?.data?.features));

      if (response?.data) {
        const altered = response?.data?.features?.map((item) => {
          return { coordinates: item?.geometry?.coordinates, ...item?.properties }
        })
        setLocationSuggestion(altered)
      }

    } catch (error) {
      console.log("searchError", error);

    }
  }

  const moveOnLocation = (item) => {
    setSearchLocation(item)
    setSearchTerm("")
    Keyboard.dismiss()
    fetchLocationDetails(item?.coordinates)
    cameraRef?.current?.setCamera({
      centerCoordinate: item?.coordinates,
      zoomLevel: 17,
      animationDuration: 2000,
    })
  }

  const getToCurrentLocation = () => {
    // cameraRef?.current?.setCamera({
    //   centerCoordinate: userLocation,
    //   zoomLevel: 17,
    //   animationDuration: 2000,
    // })
    const destination = searchLocation.coordinates ? [searchLocation.coordinates[0], searchLocation.coordinates[1]] : [locationOnPress[0], locationOnPress[1]]

    let temp = []
    temp.push([pathCoordinates[0][0], pathCoordinates[0][1]], destination)
    fetchRoute(temp[0], temp[1])
  }
  const renderItem = useCallback(({ item }) => {
    return (
      <Pressable onPress={() => moveOnLocation(item)} style={{ paddingHorizontal: WIDTH * 0.05, paddingVertical: WIDTH * 0.05 }}>
        <Text>{item?.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          {item?.city && <Text>{`${item?.city},`}</Text>}
          {item?.state && <Text>{`${item?.state},`}</Text>}
          {item?.country && <Text>{`${item?.country}`}</Text>}
        </View>
      </Pressable>
    )
  }, [])

  console.log("wheelchairEndPoint=>", pathCoordinates);
  console.log("wheelchairEndPoint1=>", searchLocation);

  // const addtoRoute = () => {
  //   console.log("hii");
  //   setSearchTerm('')
  //   if (pathCoordinates[0] === searchLocation?.coordinates) {
  //     Toast.show('Add a new location');
  //   } else {
  //     const route = pathCoordinates;
  //     route.push(searchLocation?.coordinates)
  //     console.log("route=>", route);

  //     setPathCoordinates(route)
  //   }
  // }

  const addtoRoute = () => {
    console.log("hii");
    setSearchTerm('');

    const [searchLon, searchLat] = searchLocation.coordinates || locationOnPress;

    const exists = pathCoordinates.some(
      ([pathLon, pathLat]) =>
        pathLon === searchLon && pathLat === searchLat
    );

    if (exists) {
      Toast.show('Add a new location');
    } else {
      const updatedRoute = [...pathCoordinates, searchLocation.coordinates || locationOnPress];
      console.log("route =>", updatedRoute);
      setPathCoordinates(updatedRoute);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ position: 'absolute', top: 50, zIndex: 1, alignSelf: 'center' }}>
          <View style={{ height: 60, width: WIDTH * 0.9, backgroundColor: 'white', alignSelf: 'center', borderRadius: WIDTH, justifyContent: 'space-between', paddingHorizontal: WIDTH * 0.05, flexDirection: 'row', alignItems: 'center', }}>
            <Image source={HamBurger} />
            <TextInput
              style={{ width: WIDTH * 0.6, height: WIDTH * 0.1 }}
              placeholder='Search for'
              returnKeyType='search'
              onChangeText={(text: string) => {
                setSearchTerm(text)
                setTimeout(() => {
                  searchTerm != '' && setLocationSuggestion({})
                  handleSuggestionSearch()
                }, 400)
              }}
            />
            <Image source={MicroPhone} />
          </View>
          {searchTerm != '' && <FlatList
            style={{ backgroundColor: 'white', maxHeight: WIDTH * 0.9 }}
            data={locationSuggestion}
            renderItem={renderItem}
          />}
        </View>
        <MapView
          style={styles.map}
          logoEnabled={false}
          compassEnabled={true}
          rotateEnabled={true}
          mapStyle={require('../components/OsmJson.json')}
          onRegionDidChange={() => handleRegionChange()}
          // onRegionDidChange={(e) => handleRegionChange(e)}
          // onRegionDidChange={handleRegionChange}
          onPress={(feature: GeoJSON.Feature) => {
            setLocationOnPress(feature?.geometry?.coordinates)
            fetchLocationDetails(feature?.geometry?.coordinates)
          }}
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

          {searchLocation?.coordinates && <PointAnnotation id="user-location" coordinate={searchLocation?.coordinates}>

            <View style={{ width: 18, height: 18, borderRadius: 15, backgroundColor: 'red', borderColor: '#fff', borderWidth: 2 }} />
          </PointAnnotation>}
          {!isEmpty(locationOnPress) && <PointAnnotation id="destination-location" coordinate={locationOnPress}>

            <View style={{ width: 18, height: 18, borderRadius: 15, backgroundColor: 'red', borderColor: '#fff', borderWidth: 2 }} />
          </PointAnnotation>}
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
          {/* {userLocation && routeCoords.length > 0 && (
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
          )} */}

          {/* <PointAnnotation id="destination" coordinate={[DESTINATION.lon, DESTINATION.lat]} >
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'blue', borderColor: '#fff', borderWidth: 2 }} />
          </PointAnnotation> */}
          {!isEmpty(pathCoordinates) && <PointAnnotation id="destination" coordinate={[pathCoordinates[0][0], pathCoordinates[0][1]]} >
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'blue', borderColor: '#fff', borderWidth: 2 }} />
          </PointAnnotation>}
        </MapView>
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 15, justifyContent: 'space-between',/*  flexDirection: 'row'  */ }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            {searchLocation !== [] && (
              <View style={{ flexDirection: 'row', gap: 20 }}>

                {isEmpty(locationOnPress) && <Pressable onPress={() => addtoRoute()} style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'center' }}>
                  {pathCoordinates?.length > 0 ? <Text>{`Add more location \nto the route`}</Text> : <Text>Add to route</Text>}
                </Pressable>}
                {pathCoordinates?.length > 0 && (
                  <Pressable onPress={() => {
                    setSearchLocation('')
                    setPathCoordinates([])
                    setWayPoints([]);
                    setRouteCoords([]);
                    setInstructions([])
                    setSearchTerm('')
                    setLocationOnPress([])
                  }} style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'center' }}>
                    <Text>Clear route</Text>
                  </Pressable>
                )}
              </View>

            )}
            <Pressable onPress={() => getToCurrentLocation()} style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'center' }}>
              <Text>Get route</Text>
            </Pressable>
            <Pressable onPress={() => fetchRoute(pathCoordinates)} style={{ backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, alignSelf: 'center' }}>
              <Text>Current</Text>
            </Pressable>
          </View>
          {!isEmpty(locationOnPress) && !isEmpty(coordinateDetails) && < View style={{ width: WIDTH, height: HEIGHT * 0.3, backgroundColor: 'white', borderRadius: 10, padding: WIDTH * 0.05 }}>
            <Text style={{ color: 'black', fontSize: 20 }}>{coordinateDetails?.features?.[0]?.properties?.label}</Text>
            <Text style={{ color: 'black', fontSize: 15 }}>{coordinateDetails?.features?.[0]?.properties?.county}, {coordinateDetails?.features?.[0]?.properties?.region}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Pressable onPress={() => addtoRoute()} style={{ backgroundColor: '#3275a8', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, maxWidth: WIDTH * 0.3, justifyContent: 'center', alignItems: 'center' }}>
              {pathCoordinates?.length > 0 ? <Text style={{ color: 'white' }}>{`Add more location \nto the route`}</Text> : <Text style={{ color: 'white' }}>Add to route</Text>}
            </Pressable>
              <Pressable style={{ height: WIDTH * 0.08, width: WIDTH * 0.08 }}><Image source={loveIcon2} resizeMode='contain' style={{ tintColor: 'black' }} /></Pressable>
            </View>


          </View>}

        </View>

        <>

          {loading && <View style={{ backgroundColor: '#00000090', position: 'absolute', top: 0, width: WIDTH, height: HEIGHT, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator style={{ height: 50, width: 50 }} size={'large'} /></View>}
        </>
        {/* <View style={styles.instructions}>
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
        </View> */}
      </View >
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
