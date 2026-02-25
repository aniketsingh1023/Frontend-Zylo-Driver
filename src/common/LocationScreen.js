import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import Button from './Button';
import GooglePlacesInput from './GooglePlacesInput';
import { Font } from './Theam';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

export default LocationScreen = ({
  setopenLocationModal,
  fieldName,
  setLocationDetails,
}) => {
  const [location, setLocation] = useState();
  const [region, setRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);


  const reverseGeocode = async (latitude, longitude) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB-T2GimiJHK0Ndb9RV02CUgIoR4dMU7q0`,
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        let city, state, country, postal_code, streetAddress;
        let cityFullName, stateFullName, countryFullName;

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.short_name;
            cityFullName = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
            stateFullName = component.long_name;
          } else if (types.includes('country')) {
            country = component.short_name;
            countryFullName = component.long_name;
          } else if (types.includes('postal_code')) {
            postal_code = component.long_name;
          } else if (
            types.includes('route') ||
            types.includes('street_address')
          ) {
            streetAddress = component.long_name;
          }
        });

        
        if (!streetAddress) {
          streetAddress = data.results[0].formatted_address.split(',')[0];
        }

        const addressData = {
          streetAddress: streetAddress || cityFullName || '',
          city: cityFullName || '',
          state: stateFullName || '',
          zipcode: postal_code || '',
          country: countryFullName || '',
          addressLink: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        };

        
        setLocationDetails(addressData);
        console.log('Auto-filled address:', addressData);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          
          reverseGeocode(latitude, longitude);
        },
        error => {
          console.log('Location error:', error);
          Alert.alert(
            'Location Error',
            'Could not get your current location. Please search for an address.',
          );
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    };

    requestLocationPermission();
  }, []);
  const handleMarkerDragEnd = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
    
    reverseGeocode(latitude, longitude);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {region.latitude && region.longitude && (
              <Marker
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title={'Your Location'}
              />
            )}
          </MapView>
          <GooglePlacesInput
            // formikObj={formikObj}
            setRegion={setRegion}
            fieldName={fieldName}
            setLocationDetails={setLocationDetails}
          />
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginVertical: 10,
          }}
        >
          <View
            style={{ width: '20%', marginVertical: 0, marginHorizontal: 20 }}
          >
            <Button
              buttonName={'Cancel'}
              onPress={() => {
                setopenLocationModal(false);
              }}
            />
          </View>
          <View style={{ width: '20%', marginVertical: 0 }}>
            <Button
              buttonName={'Save'}
              onPress={() => {
                setopenLocationModal(false);
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  subContainer: {
    // flex: 1,
    // margin: 20,
  },
  card: {
    // borderWidth: 1,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  edit: {
    fontSize: 14,
    fontFamily: Font.textNormal,
    textDecorationLine: 'underline',
  },
  contentText: {
    fontSize: 14,
    fontFamily: Font.textNormal,
  },
  noContent: {
    fontSize: 14,
    fontFamily: Font.textNormal,
    color: 'red',
  },
  line: { marginVertical: 20 },
});
