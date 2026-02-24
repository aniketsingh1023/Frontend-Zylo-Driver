import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import Button from './Button';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';
import {Font} from './Theam';
import {SVG} from './SvgHelper';
import Header from './Heading';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Define Navigation Stack Type (Modify according to your navigation setup)
type RootStackParamList = {
  SignUpScreen: undefined;
};

// Define Props for the Modal Component
interface LocationEnableModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const LocationEnableModal: React.FC<LocationEnableModalProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <Modal isVisible={isModalVisible} style={styles.modalStyle}>
      <View style={styles.modalContainer}>
        <SVG.LocationIcon />
        <View style={styles.textContainer}>
          <Header>Enable your location</Header>
          <CustomText style={styles.descriptionText}>
            Choose your location to start finding requests around you
          </CustomText>
        </View>
        <Button
          buttonName="Use my location"
          btnwidth="90%"
          onPress={() => {
            setIsModalVisible(false);
            // navigation.navigate('SignUpScreen');
          }}
          style={styles.button}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    marginVertical: '50%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: Font.textBolder,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    marginTop: 20,
  },
});

export default LocationEnableModal;
