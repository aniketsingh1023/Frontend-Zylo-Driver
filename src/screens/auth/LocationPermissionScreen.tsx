import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WrapperScreen from '../../common/WrapperScreen';
import {SVG} from '../../common/SvgHelper';
import {Font} from '../../common/Theam';
import Button from '../../common/Button';
import LocationEnableModal from '../../common/LocationEnableModal';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '.';
import {useNavigation} from '@react-navigation/native';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'LocationPermissionScreen'
>;

const LocationPermissionScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  return (
    <WrapperScreen>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SignUpScreen');
        }}
        style={styles.container}>
        <Image source={require('../../assets/image/other/Map.png')} />
      </TouchableOpacity>
      <LocationEnableModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    height: '100%',
  },
});

export default LocationPermissionScreen;
