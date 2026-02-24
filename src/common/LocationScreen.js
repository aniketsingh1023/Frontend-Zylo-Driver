import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Button from './Button';
import GooglePlacesInput from './GooglePlacesInput';
import {Font} from './Theam';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default LocationScreen = ({
  setopenLocationModal,
  // formikObj,
  fieldName,
  setLocationDetails,
}) => {
  // const {location} = useSelector(state => state.userRedux);
  const [location, setLocation] = useState();
  const [region, setRegion] = React.useState({
    latitude: location?.lat || 0,
    longitude: location?.lng || 0,
  });
  const handleMarkerDragEnd = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setRegion(prev => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{flex: 1, marginTop: 10}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
              // latitude: 37.78825,
              // longitude: -122.4324,
              // latitudeDelta: 0.0922,
              // longitudeDelta: 0.0421,
            }}
            region={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
            onRegionChangeComplete={setRegion}>
            {region.latitude != 0 &&
              region.longitude != 0 &&
              region.latitude &&
              region.longitude && (
                <Marker
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  // key={index}
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                  title={'Your Location1'}
                  // description={marker.description}
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
          }}>
          <View style={{width: '20%', marginVertical: 0, marginHorizontal: 20}}>
            <Button
              buttonName={'Cancel'}
              onPress={() => {
                setopenLocationModal(false);
              }}
            />
          </View>
          <View style={{width: '20%', marginVertical: 0}}>
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
  line: {marginVertical: 20},
});
