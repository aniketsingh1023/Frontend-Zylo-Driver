import React, {useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AuthStackParamList} from '.';
import {signUpApi} from '../../api/authApis';
import {ImageType, SignUpFormPayload} from '../../api/types/authTypes';
import {IAddress, UserType} from '../../api/types/userTypes';
import {Colors} from '../../common/Theam';
import {SVG} from '../../common/SvgHelper';
import Header from '../../common/Header';
import Input from '../../common/Input';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import WrapperScreen from '../../common/WrapperScreen';
import LocationScreen from '../../common/LocationScreen';

import {infoToast, successToast, errorToast} from '../../components/toasts';
import {extractErrorMessage} from '../../utils/helper';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DashboardScreen'
>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const userState: UserType = useSelector(
    (state: any) => state?.Userinfo?.user,
  );
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImageType | null>(null);
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const handleImagePicker = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 1050,
        height: 700,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
      });

      const selectedImage: ImageType = {
        name: img.filename || 'profileImage',
        uri: img.path,
        path: img.path,
        type: img.mime,
      };

      setImage(selectedImage);
    } catch (err) {
      console.log('Image Picker Cancelled');
    }
  };

  const validateSignUp = (user: UserType, img: ImageType | null) => {
    if (!img) return 'Profile image is required';
    if (!user?.firstName?.trim()) return 'First name is required';
    if (!user?.email?.trim()) return 'Email is required';
    if (!user?.password?.trim()) return 'Password is required';
    if (!user?.phoneNumber?.trim()) return 'Phone number is required';

    const address = user?.address || {};
    const requiredFields: (keyof IAddress)[] = [
      'streetAddress',
      'city',
      'state',
      'zipcode',
      'country',
      'addressLink',
    ];

    for (const field of requiredFields) {
      const value = address[field];
      if (!value?.trim()) {
        return `${field.replace(/([A-Z])/g, ' $1')} is required`;
      }
    }

    return null;
  };

  const buildPayload = (user: UserType, img: ImageType): SignUpFormPayload => ({
    profilePicture: img,
    firstName: user.firstName,
    lastName: user.lastName || '',
    email: user.email,
    userName: `${user.firstName}${user.lastName}${user.phoneNumber}`,
    password: user.password || '',
    phoneNumber: user.phoneNumber || '',
    address: {
      streetAddress: user.address?.streetAddress || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipcode: user.address?.zipcode || '',
      country: user.address?.country || '',
      addressLink: user.address?.addressLink || '',
      addressTitle: user.address?.addressTitle || 'User address',
    },
  });

  const handleSignUp = async () => {
    try {
      const errorMsg = validateSignUp(userState, image);
      if (errorMsg) return infoToast(errorMsg);

      const payload = buildPayload(userState, image!);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      setLoading(true);

      const response = await signUpApi(payload);
      console.log('API Response:', response);

      if (response?.remote === 'success') {
        successToast(response.data.data);
        navigation.navigate('SignInScreen');
      } else {
        errorToast(extractErrorMessage(response));
      }
    } catch (error) {
      console.log('SignUp Error:', error);
      errorToast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperScreen>
      <Header showBack title="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture */}
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.profileContainer}>
          <View style={styles.profilePicture}>
            <Image
              source={
                image?.path
                  ? {uri: image.path}
                  : require('../../assets/image/other/DefaultImage.jpg')
              }
              style={styles.profilePicture}
            />
            <SVG.CameraIcon style={styles.cameraIcon} />
          </View>
        </TouchableOpacity>

        {/* User Info */}
        <Input
          placeholder="First Name"
          value={userState?.firstName}
          editable={false}
        />
        <Input
          placeholder="Last Name"
          value={userState?.lastName}
          editable={false}
        />
        <Input
          placeholder="Mobile Number"
          value={userState?.phoneNumber}
          editable={false}
        />
        <Input placeholder="Email" value={userState?.email} editable={false} />

        {/* Address Section */}
        <TouchableOpacity
          onPress={() => setOpenLocationModal(true)}
          style={styles.locationButton}>
          <CustomText style={styles.locationText}>
            📍 Tap to fill address using map
          </CustomText>
        </TouchableOpacity>

        <Input
          placeholder="Street"
          value={userState?.address?.streetAddress}
          editable={false}
        />
        <Input
          placeholder="City"
          value={userState?.address?.city}
          editable={false}
        />
        <Input
          placeholder="State"
          value={userState?.address?.state}
          editable={false}
        />
        <Input
          placeholder="Country"
          value={userState?.address?.country}
          editable={false}
        />
        <Input
          placeholder="Zip Code"
          value={userState?.address?.zipcode}
          editable={false}
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            buttonName="Cancel"
            btnwidth="45%"
            bgcolor="white"
            btncolor="#EDAE10"
            btnborder={1}
            bordercolor="#EDAE10"
            onPress={() => navigation.navigate('SignInScreen')}
          />
          <Button
            loader={loading}
            buttonName="Save"
            btnwidth="45%"
            onPress={handleSignUp}
          />
        </View>
      </ScrollView>

      {/* Location Modal */}
      <Modal
        isVisible={openLocationModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{marginTop: 0}}>
        <SafeAreaView style={styles.modalContainer}>
          <LocationScreen
            fieldName={'location'}
            setopenLocationModal={setOpenLocationModal}
            setLocationDetails={() => {}}
          />
        </SafeAreaView>
      </Modal>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D0D0D0',
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  locationButton: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  locationText: {
    fontSize: 16,
    color: '#007aff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ProfileScreen;
