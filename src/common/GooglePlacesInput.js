import React from 'react';
import {StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Colors, Font} from './Theam';
import {storeUserDetails} from '../Redux/Reducer/UserinfoReducer';
import {useDispatch, useSelector} from 'react-redux';

const GooglePlacesInput = ({
  // formikObj,
  setRegion,
  fieldName,
  setLocationDetails,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state?.Userinfo?.user);

  return (
    <GooglePlacesAutocomplete
      placeholder={'Search Location'}
      minLength={2}
      autoFocus={false}
      returnKeyType={'default'}
      fetchDetails={true}
      onPress={(data, details = null) => {
        // formikObj.setFieldValue(fieldName, data.description);
        const {lat, lng} = details.geometry.location;
        console.log('data', JSON.stringify(data));
        console.log('details', JSON.stringify(details));

        const addressComponents = details.address_components;

        let city, state, country, postal_code;
        let cityFullName, stateFullName, countryFullName;

        console.log('ADDRESS COMPONENT---->', addressComponents);

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            city = component.short_name;
            cityFullName = component?.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
            stateFullName = component?.long_name;
          } else if (types.includes('country')) {
            country = component.short_name;
            countryFullName = component?.long_name;
          } else if (types.includes('postal_code')) {
            postal_code = component.long_name;
          }
        });

        setLocationDetails({
          streetAddress: cityFullName,
          city: cityFullName,
          state: stateFullName,
          zipcode: postal_code,
          country: countryFullName,
          addressLink: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });
        setRegion({latitude: lat, longitude: lng});

        let address = {
          streetAddress: cityFullName,
          city: cityFullName,
          state: stateFullName,
          zipcode: postal_code,
          country: countryFullName,
          addressLink: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        };

        dispatch(
          storeUserDetails({
            ...userState,
            address: address,
          }),
        );
      }}
      query={{
        key: 'AIzaSyB-T2GimiJHK0Ndb9RV02CUgIoR4dMU7q0',
        language: 'en',
      }}
      textInputProps={{
        placeholderTextColor: Colors.black,
      }}
      styles={{
        container: {
          width: '100%',
          height: '100%',
          // position: 'absolute',
          // zIndex: 10,
          // backgrourndCologwr: '#f00',
        },
        textInputContainer: {
          marginVertical: 10,
          borderWidth: 1,
          borderColor: 'black',
          height: 56,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 8,
          fontFamily: Font.textNormal,
        },
        textInput: {
          width: '100%',
          fontSize: 16,
          fontFamily: Font.textNormal,
          shadowColor: '#6B6B66',
          padding: 10,
          color: '#1E1E1E',
        },
        predefinedPlacesDescription: {
          color: 'red',
          // height: 200,
        },
        row: {
          backgroundColor: '#ffffff',
          padding: 13,
          height: 44,
          flexDirection: 'row',
        },
        description: {
          color: 'black',
          fontFamily: Font.textNormal,
        },
      }}
    />
    // </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: Colors.black,
    height: 44,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: '#c8c7cc',
    borderTopWidth: 0.5,
  },
  powered: {},
  listView: {},
  row: {
    backgroundColor: '#ffffff',
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#c8c7cc',
  },
  description: {
    color: Colors.black,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
});
export default GooglePlacesInput;
