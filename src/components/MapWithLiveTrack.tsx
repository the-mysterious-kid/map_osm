import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapboxGL from '@maplibre/maplibre-react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const MapWithLiveTrack = () => {
    const mapRef = useRef<MapView>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [isFollowingUser, setIsFollowingUser] = useState(true);
    const animatedCoordinate = useSharedValue<[number, number]>([0, 0]);

    // Dummy route data for testing (replace with actual route data)
    useEffect(() => {
        setRouteCoords([
            [-122.4194, 37.7749], // San Francisco
            [-122.4195, 37.7750],
            [-122.4196, 37.7751],
            // Add more coordinates to your route...
        ]);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <MapboxGL.MapView
                ref={mapRef}
                style={{ flex: 1 }}
                showsUserLocation={true}
                compassEnabled={true}
                onTouchStart={() => setIsFollowingUser(false)}
            >
                <MapboxGL.UserLocation
                    visible={true}
                    androidRenderMode="gps"
                    minDisplacement={1}
                    onUpdate={(location) => {
                        const { latitude, longitude, speed, heading } = location.coords;
                        setUserLocation([longitude, latitude]);

                        // Animate to new location
                        animatedCoordinate.value = withTiming([longitude, latitude], { duration: 1000 });

                        // Dynamic zoom based on speed
                        let dynamicZoom = 16;
                        if (speed > 10) dynamicZoom = 14;  // Driving
                        else if (speed > 3) dynamicZoom = 15; // Biking

                        if (isFollowingUser && mapRef.current) {
                            mapRef.current.setCamera({
                                centerCoordinate: [longitude, latitude],
                                zoomLevel: dynamicZoom,
                                bearing: heading ?? 0, // Smooth rotation based on heading
                                animationDuration: 1000,
                            });
                        }
                    }}
                />

                {/* Route Polyline */}
                {routeCoords.length > 0 && (
                    <MapboxGL.ShapeSource
                        id="routeSource"
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: routeCoords,
                            },
                        }}
                    >
                        <MapboxGL.LineLayer
                            id="routeLine"
                            style={{
                                lineColor: 'blue',
                                lineWidth: 5,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}

                {/* Animated Marker */}
                <MapboxGL.Marker coordinate={animatedCoordinate.value}>
                    <Animated.View
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: 'blue',
                            borderRadius: 15,
                        }}
                    />
                </MapboxGL.Marker>
            </MapboxGL.MapView>

            {/* Recenter Button */}
            {!isFollowingUser && (
                <TouchableOpacity
                    onPress={() => {
                        if (userLocation && mapRef.current) {
                            mapRef.current.setCamera({
                                centerCoordinate: userLocation,
                                zoomLevel: 16,
                                animationDuration: 1000,
                            });
                            setIsFollowingUser(true);
                        }
                    }}
                    style={{
                        position: 'absolute',
                        bottom: 50,
                        right: 20,
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 50,
                        elevation: 5,
                    }}
                >
                    <Text>Recenter</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MapWithLiveTrack;
