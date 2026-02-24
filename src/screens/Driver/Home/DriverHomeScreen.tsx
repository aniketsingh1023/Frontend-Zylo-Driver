import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { OtpInput } from 'react-native-otp-entry';
import Button from '../../../common/Button';
import CustomText from '../../../common/CustomText';
import DriverFooter from '../../../common/DeriverFooter';
import { SVG } from '../../../common/SvgHelper';
import { Font } from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';
import MapScreen from '../../../components/map/mapScreen';
import { infoToast, successToast } from '../../../components/toasts';
import { useToggleStatus } from '../../../data-access/mutations/auth';
import { AuthStackParamList } from '../../auth';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DriverHomeScreen'
>;

const DriverHomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const { mutate: toggleStatus } = useToggleStatus();

  const [isOffline, setIsOffline] = useState(true);
  const [rideRequestModal, setRideRequestModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [isRideStarted, setIsRideStarted] = useState(false);

  const handleGoOnline = async () => {
    handleToggleStatus();

    // setRideRequestModal(true);
  };

  const handleToggleStatus = async () => {
    toggleStatus(undefined, {
      onSuccess: data => {
        console.log('handleToggleStatus data', data);
        if (data?.remote == 'success') {
          setIsOffline(false);
          successToast(data?.data?.message || 'Status updated successfully');
        } else {
          if (isOffline == true) {
            infoToast(data.errors.errors.message);
          }
        }
      },
    });
  };

  return (
    <WrapperScreen>
      {isOffline ? (
        <View style={styles.container}>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[!isOffline ? styles.inactiveToggle : styles.activeToggle]}
              onPress={() => {
                setIsOffline(true);
                handleToggleStatus();
              }}
            >
              <CustomText style={styles.toggleText}>Offline</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[isOffline ? styles.inactiveToggle : styles.activeToggle]}
              onPress={handleGoOnline}
            >
              <CustomText style={styles.toggleText}>Online</CustomText>
            </TouchableOpacity>
          </View>

          {/* Waiting Message */}
          <View style={styles.waitBox}>
            <CustomText style={styles.waitText}>
              Searching for rides please wait
            </CustomText>
          </View>

          {/* Center Car Image */}
          <Image
            source={require('../../../assets/image/other/HomeLocation.png')}
            style={styles.centerImage}
          />
        </View>
      ) : (
        <ImageBackground
          source={require('../../../assets/image/other/Map.png')}
          style={{ flex: 1 }}
        >
          {/* Toggle */}
          <View style={{ padding: 20, zIndex: 1 }}>
            <View
              style={[styles.toggleContainer, { backgroundColor: '#FFFBE7' }]}
            >
              <TouchableOpacity
                style={[
                  !isOffline ? styles.inactiveToggle : styles.activeToggle,
                ]}
                onPress={() => {
                  setIsOffline(true);
                  handleToggleStatus();
                }}
              >
                <CustomText style={[styles.toggleText]}>Offline</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  isOffline ? styles.inactiveToggle : styles.activeToggle,
                ]}
              >
                <CustomText style={styles.toggleText}>Online</CustomText>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <MapScreen />
          </View>

          {/* Ride Request Modal */}
          <Modal
            isVisible={rideRequestModal}
            onBackdropPress={() => setRideRequestModal(false)}
            style={styles.bottomModal}
          >
            <View style={styles.modalBox}>
              <View style={styles.centerLine} />
              <CustomText style={styles.rideTitle}>
                Hey! Julia wants to ride with you
              </CustomText>

              {/* User Info */}
              <View style={styles.userRow}>
                <Image
                  source={require('../../../assets/image/other/ProfileImg.png')}
                />
                <View style={{ marginLeft: 10 }}>
                  <CustomText>Julia Lopez</CustomText>
                  <View style={styles.row}>
                    <SVG.Location />
                    <CustomText>800m (5mins away)</CustomText>
                  </View>
                </View>
              </View>

              <Image
                source={require('../../../assets/image/other/locationlist.png')}
                style={{ marginVertical: 10 }}
              />

              {isRideStarted ? (
                <View style={{ alignItems: 'center' }}>
                  <SVG.SliderButton />

                  <CustomText style={styles.sliderText}>
                    The payment will be released after completing the ride.
                  </CustomText>

                  <TouchableOpacity>
                    <CustomText style={styles.cancelRide}>
                      Cancel ride
                    </CustomText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.rowSpace}>
                  <TouchableOpacity
                    style={styles.butonview}
                    onPress={() => setOtpModal(true)}
                  >
                    <CustomText
                      style={[styles.buttontext, { color: '#FFFFFF' }]}
                    >
                      Accept
                    </CustomText>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.disablebuttton}>
                    <CustomText
                      style={[styles.buttontext, { color: '#414141' }]}
                    >
                      Decline
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>

          {/* OTP Modal */}
          <Modal
            isVisible={otpModal}
            onBackdropPress={() => setOtpModal(false)}
            style={{ justifyContent: 'center', margin: 0 }}
          >
            <View style={styles.verifyContainer}>
              <CustomText style={styles.verificationText}>
                User verification
              </CustomText>
              <CustomText style={styles.verifyDesc}>
                Enter OTP given by the user to start the ride
              </CustomText>

              <View style={styles.otpContainer}>
                <OtpInput
                  numberOfDigits={6}
                  theme={{
                    pinCodeContainerStyle: styles.otpInputContainer,
                    pinCodeTextStyle: styles.otpInputText,
                    filledPinCodeContainerStyle: styles.filledinput,
                  }}
                />
              </View>

              <Button
                buttonName="Start Ride"
                onPress={() => {
                  setOtpModal(false);
                  // setIsRideStarted(true);
                }}
              />
            </View>
          </Modal>
        </ImageBackground>
      )}

      <DriverFooter isHome />
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },

  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FEC400',
    height: 60,
    borderRadius: 10,
    marginVertical: 20,
  },
  verifyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeToggle: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FEC400',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  inactiveToggle: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFFBE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  toggleText: {
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
    color: '#414141',
  },

  waitBox: { width: '80%', alignSelf: 'center', marginVertical: 30 },
  waitText: {
    color: '#2A2A2A',
    fontSize: 24,
    fontFamily: Font.textNormal,
    textAlign: 'center',
  },

  centerImage: { alignSelf: 'center', marginTop: 20 },

  bottomModal: { justifyContent: 'flex-end', margin: 0 },

  modalBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  centerLine: {
    width: 50,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },

  rideTitle: {
    fontSize: 18,
    fontFamily: Font.textSemiBolder,
    textAlign: 'center',
    color: '#2A2A2A',
    marginVertical: 10,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  activebuttonstyle: {
    backgroundColor: '#FEC400',
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  row: { flexDirection: 'row', alignItems: 'center' },

  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },

  sliderText: {
    fontSize: 10,
    fontFamily: Font.textNormal,
    color: '#B8B8B8',
    textAlign: 'center',
    marginVertical: 5,
  },

  cancelRide: {
    fontSize: 16,
    fontFamily: Font.textSemiBolder,
    color: '#EDAE10',
    borderBottomWidth: 1,
    borderColor: '#EDAE10',
    marginTop: 10,
  },

  butonview: {
    width: '48%',
    height: 50,
    backgroundColor: '#EDAE10',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  disablebuttton: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDAE10',
  },

  verificationText: {
    fontSize: 24,
    color: '#2A2A2A',
    fontFamily: Font.textSemiBolder,
    textAlign: 'center',
  },

  verifyDesc: {
    fontSize: 14,
    fontFamily: Font.textNormal,
    color: '#6C6C6C',
    textAlign: 'center',
    marginTop: 8,
  },

  otpContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 28,
  },

  otpInputContainer: {
    width: 50,
    height: 48,
  },

  otpInputText: {
    fontFamily: Font.textBolder,
    fontSize: 16,
    color: '#414141',
  },

  filledinput: {
    backgroundColor: '#FFFDE7',
    borderColor: '#F6CD56',
  },

  buttontext: {
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
  },
});

export default DriverHomeScreen;
