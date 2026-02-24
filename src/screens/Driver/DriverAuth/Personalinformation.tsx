import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { ImageType } from '../../../api/types/authTypes';
import {
  IDocumentsList,
  IRiderSignUpFormPayload,
} from '../../../api/types/riderTypes';
import { IAddress, UserType } from '../../../api/types/userTypes';
import Button from '../../../common/Button';
import CustomText from '../../../common/CustomText';
import Header from '../../../common/Header';
import Input from '../../../common/Input';
import LocationScreen from '../../../common/LocationScreen';
import { SVG } from '../../../common/SvgHelper';
import { Colors, Font } from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';
import {
  errorToast,
  infoToast,
  successToast,
} from '../../../components/toasts';
import { useSignUp } from '../../../data-access/mutations/auth';
import { AuthStackParamList } from '../../auth';
import Drivinglicense from './components/Drivinglicense';
import Governmentid from './components/Governmentid';
import { extractErrorMessage } from '../../../utils/helper';
import {
  logoutUserInfoRedux,
  storeUserDetails,
} from '../../../Redux/Reducer/UserinfoReducer';

const steps = [
  { id: 1, title: 'Personal Info' },
  // {id: 2, title: 'Self Verification'},
  { id: 2, title: 'Government ID' },
  { id: 3, title: 'Driving License' },
];
type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'Personalinformation'
>;

const Personalinformation = () => {
  const dispatch = useDispatch();
  const userState: UserType = useSelector(
    (state: any) => state?.Userinfo?.user,
  );
  // console.log('userState', userState);

  const { mutate: signUp, isPending } = useSignUp();

  const navigation = useNavigation<NavigationProps>();
  const [activeStep, setActiveStep] = useState(1);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [profileImg, setProfileImg] = useState<ImageType | null>(null);
  const [documentImg, setDocumentImg] = useState<ImageType | null>(null);
  const [drivingLicense, setDrivingLicenseImg] = useState<ImageType | null>(
    null,
  );
  const [name, setname] = useState(userState?.firstName || '');
  const [lastName, setlastName] = useState(userState?.lastName || '');
  const [phone, setphone] = useState(userState?.phoneNumber || '');
  const [email, setemail] = useState(userState?.email || '');

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

      setProfileImg(selectedImage);
    } catch (err) {
      console.log('Image Picker Cancelled');
    }
  };
  console.log(activeStep);

  const nextStep = () => {
    if (activeStep === steps.length) {
      handleRiderRegistration();
    }
    console.log('activeStep', activeStep);

    if (activeStep == 0 || activeStep === 1) {
      dispatch(
        storeUserDetails({
          ...userState,
          firstName: name,
          lastName: lastName,
          email: email,
          phoneNumber: phone,
        }),
      );
    }
    if (activeStep < steps.length) setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  const renderStepper = () => (
    <View style={styles.stepperContainer}>
      {steps.map((item, index) => {
        const isActive = activeStep >= item.id;
        return (
          <View key={item.id} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                { backgroundColor: isActive ? '#EDAE10' : '#D9D9D9' },
              ]}
            >
              <CustomText style={styles.stepText}>{item.id}</CustomText>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor:
                      activeStep > item.id ? '#EDAE10' : '#D9D9D9',
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Profile Picture */}
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.profileContainer}
            >
              <View style={styles.profilePicture}>
                <Image
                  source={
                    profileImg?.path
                      ? { uri: profileImg.path }
                      : require('../../../assets/image/other/DefaultImage.jpg')
                  }
                  style={styles.profilePicture}
                />
                <SVG.CameraIcon style={styles.cameraIcon} />
              </View>
            </TouchableOpacity>

            {/* User Info */}
            <Input
              placeholder="First Name"
              keyboardType="default"
              maxLength={50}
              value={name}
              onChangeText={text => setname(text)}
            />
            <Input
              placeholder="Last Name"
              keyboardType="default"
              maxLength={50}
              value={lastName}
              onChangeText={text => setlastName(text)}
            />
            <Input
              placeholder="Email"
              keyboardType="email-address"
              maxLength={100}
              value={email}
              onChangeText={text => setemail(text)}
              onBlur={() => {
                if (email.trim() === '') {
                  infoToast('Email is required.');
                  return;
                }
                if (!/\S+@\S+\.\S+/.test(email)) {
                  infoToast('Please enter a valid email address.');
                  return;
                }
              }}
            />
            <Input
              placeholder="Your mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={text => setphone(text)}
            />

            {/* Address Section */}
            <TouchableOpacity
              onPress={() => setOpenLocationModal(true)}
              style={styles.locationButton}
            >
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
            {/* <View style={styles.buttonContainer}>
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
        </View> */}
          </ScrollView>
        );
      // case 2:
      //   return <Selfverfication />;
      case 2:
        return <Governmentid image={documentImg} setImage={setDocumentImg} />;
      case 3:
        return (
          <Drivinglicense
            image={drivingLicense}
            setImage={setDrivingLicenseImg}
          />
        );
      default:
        return null;
    }
  };

  const validateSignUp = (
    user: UserType,
    profileImg: ImageType | null,
    documerntImg: ImageType | null,
    drivingLicense: ImageType | null,
  ) => {
    if (!profileImg) return 'Profile image is required';
    if (!documerntImg) return 'documerntImg image is required';
    if (!drivingLicense) return 'drivingLicense image is required';
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
  const handleRiderRegistration = async () => {
    try {
      const errorMsg = validateSignUp(
        userState,
        profileImg,
        documentImg,
        drivingLicense,
      );
      if (errorMsg) return infoToast(errorMsg);
      let documentList: IDocumentsList[] = [
        {
          file: documentImg,
          documentExpiryDate: '2028-11-07T00:26:47.845Z',
          documentNumber: '1234567890',
        },
        {
          file: drivingLicense,
          documentExpiryDate: '2028-11-07T00:26:47.845Z',
          documentNumber: '9876543210',
        },
      ];

      let payload: IRiderSignUpFormPayload = {
        firstName: userState.firstName,
        lastName: userState.lastName || '',
        email: userState.email,
        userName:
          `${userState.firstName}${userState.lastName}${userState.phoneNumber}`
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .trim(),
        password: userState.password || '',
        phoneNumber: userState.phoneNumber || '',
        address: {
          streetAddress: userState.address?.streetAddress || '',
          city: userState.address?.city || '',
          state: userState.address?.state || '',
          zipcode: userState.address?.zipcode || '',
          country: userState.address?.country || '',
          addressLink: userState.address?.addressLink || '',
          addressTitle: userState.address?.addressTitle || 'Rider address',
        },
        profilePicture: profileImg,
        documents: documentList,
      };
      console.log('payload', JSON.stringify(payload, null, 2));

      signUp(payload, {
        onSuccess: async response => {
          if (response?.remote === 'success') {
            dispatch(logoutUserInfoRedux());
            successToast('Registration successful');
            navigation.navigate('SignInScreen');
          } else {
            errorToast(extractErrorMessage(response));
          }
        },
        onError: () => {
          errorToast('Something went wrong. Please try again.');
        },
      });
    } catch (error) {
      console.log('SignUp Error:', error);
      errorToast('Something went wrong. Please try again.');
    }
  };

  return (
    <WrapperScreen>
      <Header title="Personal information" />
      {renderStepper()}
      {renderStepContent()}

      <View style={styles.btnContainer}>
        {activeStep > 1 && (
          <Button
            buttonName="Back"
            btnwidth={'48%'}
            onPress={prevStep}
            bgcolor={'#C4C4C4'}
          />
        )}
        <Button
          loader={isPending}
          buttonName={activeStep === steps.length ? 'Finish' : 'Next'}
          btnwidth={activeStep > 1 ? '48%' : '100%'}
          onPress={nextStep}
        />
      </View>
      {/* Location Modal */}
      <Modal
        isVisible={openLocationModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ marginTop: 0 }}
      >
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
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  stepCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
  },
  stepLine: {
    width: 35,
    height: 2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Personalinformation;
