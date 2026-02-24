/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import Geolocation from '@react-native-community/geolocation';

import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../common/Theam';
import { storeCurrentLocation } from '../../Redux/Reducer/UserinfoReducer';
import { GOOGLE_MAPS_APIKEY } from '../../utils/helper';

interface RouteInfo {
  distance: number;
  duration: number;
}
type DirectionsResult = {
  distance: number;
  duration: number;
  coordinates: { latitude: number; longitude: number }[];
};

interface GeoCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

interface GeoPosition {
  coords: GeoCoords;
  timestamp: number;
}

interface GeoWatchOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  distanceFilter?: number;
  interval?: number;
}

const MapScreen: React.FC = () => {
  const currentLocationFromRedux = useSelector(
    (state: any) => state?.Userinfo?.currentLocation,
  );

  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(
    currentLocationFromRedux || null,
  );
  const [info, setInfo] = useState<RouteInfo>({ distance: 0, duration: 0 });

  // Replace with your real pickup and drop points
  const source: LatLng = { latitude: 37.771707, longitude: -122.4053769 };
  const destination: LatLng = { latitude: 37.7987, longitude: -122.48329 };

  // Watch and update rider's current location
  useEffect(() => {
    const options: GeoWatchOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 5000,
    };

    const watchId = Geolocation.watchPosition(
      (position: any) => {
        const { latitude, longitude } = position.coords;
        dispatch(storeCurrentLocation({ latitude, longitude }));
        setCurrentLocation({ latitude, longitude });
      },
      error => console.warn('Location error:', error),
      options,
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  // Animate map to rider’s position
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      const region: Region = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(region);
    }
  }, [currentLocation]);

  if (!currentLocation) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.default} />
        <Text style={{ marginTop: 10, color: Colors.default }}>
          Fetching your location...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        followsUserLocation
        loadingEnabled
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Rider Marker */}
        {/* <Marker coordinate={currentLocation} title="You" />
         */}
        {currentLocation.latitude && currentLocation.longitude && (
          <Marker coordinate={currentLocation} title="Rider">
            <FastImage
              source={require('../../assets/image/other/Car.png')} // add your bike image here
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </Marker>
        )}

        {/* Source Marker */}
        {/* <Marker
          coordinate={currentLocation}
          title="Pickup Point"
          pinColor="green"
        /> */}

        {/* Destination Marker */}
        <Marker coordinate={destination} title="Drop Point">
          <FastImage
            source={require('../../assets/image/other/HomeLocation.png')} // add your bike image here
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </Marker>

        {/* Route Directions */}
        <MapViewDirections
          origin={currentLocation}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={6}
          strokeColor={Colors.default}
          onReady={(result: DirectionsResult) => {
            setInfo({
              distance: result.distance,
              duration: result.duration,
            });

            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
              animated: true,
            });
          }}
          onError={err => console.warn('Directions error:', err)}
        />
      </MapView>

      {/* Route Info Card */}
      {/* <View style={styles.infoCard}>
        <CustomText style={styles.infoText}>
          🚗 Distance: {info.distance.toFixed(2)} km
        </CustomText>
        <CustomText style={styles.infoText}>
          ⏱ Duration: {Math.ceil(info.duration)} min
        </CustomText>
      </View> */}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.default,
  },
});
