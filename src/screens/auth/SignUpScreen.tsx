import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStackParamList } from '.';
import { storeUserDetails } from '../../Redux/Reducer/UserinfoReducer';
import { confirmEmailApi, sendOtpToMailApi } from '../../api/authApis';
import { UserType } from '../../api/types/userTypes';
import Button from '../../common/Button';
import CommonScrollView from '../../common/CommonScrollView';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import { SingleLineComponent } from '../../common/HelperComponent';
import Input from '../../common/Input';
import PopUp from '../../common/PopUp';
import { SVG } from '../../common/SvgHelper';
import { Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';
import { errorToast, infoToast, successToast } from '../../components/toasts';
import { extractErrorMessage } from '../../utils/helper';

type NavigationProps = StackNavigationProp<AuthStackParamList, 'SignUpScreen'>;
const SignUpScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const userState: UserType = useSelector(
    (state: any) => state?.Userinfo?.user,
  );
  console.log('userState', userState);

  const [isModalVisible, setisModalVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');

  const [email, setemail] = useState(userState?.email || '');
  const [name, setname] = useState(userState?.firstName || '');
  const [lastName, setlastName] = useState(userState?.lastName || '');
  const [phone, setphone] = useState(userState?.phoneNumber || '');

  const handleSendOtpToMail = async () => {
    try {
      const response = await sendOtpToMailApi({ email: email });
      console.log(
        '✅ API Response [handleSendOtpToMail]:',
        JSON.stringify(response, null, 2),
      );
      if (response?.remote === 'success') {
        successToast(response.data.data);
      } else {
        const errorMessage = extractErrorMessage(response);
        console.log('Error Message:', errorMessage);

        errorToast(errorMessage);
      }
    } catch (error) {
      console.log('�� API Response: handleSendOtpToMail', error);
    } finally {
    }
  };
  const handleConfirmOtp = async () => {
    try {
      console.log(otp);

      const response = await confirmEmailApi({ email: email, otp: otp });
      console.log(
        '✅ API Response [handleSendOtpToMail]:',
        JSON.stringify(response, null, 2),
      );
      if (response?.remote === 'success') {
        successToast(response.data.data);
      } else {
        const errorMessage = extractErrorMessage(response);
        console.log('Error Message:', errorMessage);

        errorToast(errorMessage);
      }
    } catch (error) {
      console.log('�� API Response: handleSendOtpToMail', error);
    } finally {
    }
  };

  return (
    <WrapperScreen>
      <Header
        showBack
        title="Sign Up"
        onLeftPress={() => navigation.navigate('WelcomeScreen')}
      />
      <CommonScrollView>
        <View style={styles.container}>
          <Heading style={styles.heading}>Sign up</Heading>
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
              // setisModalVisible(true);
              // handleSendOtpToMail();
            }}
          />
          <Input
            placeholder="Your mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={text => setphone(text)}
          />
          <View style={styles.privacyPolicy}>
            <SVG.PrivacyPolicyText />
          </View>
          <Button
            buttonName="Sign Up"
            btnwidth="100%"
            onPress={() => {
              if (
                email.trim() === '' ||
                phone.trim() === '' ||
                name.trim() === '' ||
                lastName.trim() === ''
              ) {
                infoToast('Email or phone is required.');
                return;
              }
              dispatch(
                storeUserDetails({
                  ...userState,
                  firstName: name,
                  lastName: lastName,
                  email: email,
                  phoneNumber: phone,
                }),
              );
              // Navigate to OTP verification
              navigation.navigate('OtpScreen', { page: 'signup' });
            }}
            style={styles.signUpButton}
          />
          <View style={styles.footer}>
            <View style={styles.orLine}>
              <SVG.OrLine />
            </View>
            <View style={styles.socialIcon}>
              <SVG.SocialIcon />
            </View>
            <SingleLineComponent
              text1="Already have an account? "
              text2="Sign in"
              text1Click={() => navigation.navigate('SignInScreen')}
            />
          </View>
        </View>
      </CommonScrollView>
      {/* email verify pop up */}
      <PopUp
        isModalVisible={isModalVisible}
        setIsModalVisible={setisModalVisible}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setisModalVisible(false);
                }}
              >
                <SVG.CrossIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.header}>
              <Heading>Verify via otp for sign up</Heading>
              <CustomText>Enter your OTP code</CustomText>
            </View>
            <View style={styles.otpContainer}>
              <OtpInput
                numberOfDigits={6}
                theme={{
                  pinCodeContainerStyle: styles.otpInputContainer,
                  pinCodeTextStyle: styles.otpInputText,
                  filledPinCodeContainerStyle: styles.filledinput,
                }}
                onTextChange={text => {
                  setOtp(text);
                }}
                textInputProps={{
                  returnKeyType: 'done',
                }}
              />
            </View>
            <SingleLineComponent
              style={styles.resendContainer}
              text1="Didn’t receive code? "
              text2="Resend again"
            />
            <Button
              buttonName="Verify"
              btnwidth="100%"
              onPress={
                () => {
                  handleConfirmOtp();
                }
                // navigation.navigate(
                //   pagename == 'signin'
                //     ? 'DashboardScreen'
                //     : 'SetPasswordSignUpScreen',
                // )
              }
              style={styles.verifyButton}
            />
          </View>
        </View>
      </PopUp>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '80%',
  },
  heading: {
    marginBottom: 10,
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyPolicy: {
    marginVertical: 10,
  },
  signUpButton: {
    marginVertical: 20,
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  orLine: {
    marginVertical: 15,
  },
  socialIcon: {
    marginVertical: 15,
  },
  otpContainer: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  resendContainer: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  verifyButton: {
    marginVertical: 20,
  },
  filledinput: {
    backgroundColor: '#FFFDE7',
    borderColor: '#F6CD56',
    borderWidth: 1,
  },
});

export default SignUpScreen;
