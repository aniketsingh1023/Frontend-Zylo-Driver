import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { AuthStackParamList, ForgotPasswordParam } from '.';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import { SingleLineComponent } from '../../common/HelperComponent';
import { Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';
import { errorToast, infoToast, successToast } from '../../components/toasts';
import {
  useForgotPasswordSendOtpApi,
  useForgotPasswordVerifyOtpApi,
} from '../../data-access/mutations/auth';
import { extractErrorMessage } from '../../utils/helper';
type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'VerificationScreen'
>;
type ForgotPasswordRouteParam = RouteProp<
  AuthStackParamList,
  'VerificationScreen'
>;
const VerificationScreen: React.FC<ForgotPasswordParam> = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ForgotPasswordRouteParam>();
  const email = route.params?.email;
  const [otp, setOtp] = React.useState('');

  const { mutate: verifyOtp, isPending } = useForgotPasswordVerifyOtpApi();
  const { mutate: sendOtp } = useForgotPasswordSendOtpApi();

  const handleVerifyOtp = async () => {
    try {
      if (email.trim() === '') {
        infoToast('Email is required.');
        return;
      }
      if (otp.trim() === '') {
        infoToast('Otp is required.');
        return;
      }
      if (otp.length != 5) {
        infoToast('Otp is required.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        infoToast('Please enter a valid email address.');
        return;
      }
      verifyOtp(
        { email, otp },
        {
          onSuccess: async response => {
            console.log(response);

            if (response?.remote === 'success') {
              successToast('Otp Verified Successfully');
              navigation.navigate('SetPasswordForgotScreen', { email });
            } else {
              errorToast(extractErrorMessage(response));
            }
          },
          onError: () => {
            errorToast('Something went wrong. Please try again.');
          },
        },
      );
    } catch (error) {
      console.log('SignUp Error:', error);
    }
  };
  const handleSendOtp = async () => {
    try {
      if (email.trim() === '') {
        infoToast('Email is required.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        infoToast('Please enter a valid email address.');
        return;
      }
      sendOtp(email, {
        onSuccess: async response => {
          console.log(response);

          if (response?.remote === 'success') {
            successToast('Otp Sent Successfully');
            navigation.navigate('VerificationScreen', { email });
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
    }
  };

  return (
    <WrapperScreen>
      <Header showBack={true} />

      {/* Main content */}
      <View style={styles.container}>
        {/* Heading and OTP instruction */}
        <View style={styles.headerContainer}>
          <Heading>Forgot Password</Heading>
          <CustomText>Code has been sent to {email}</CustomText>
        </View>

        {/* OTP Input field */}
        <View style={styles.otpInputContainer}>
          <OtpInput
            numberOfDigits={5}
            onTextChange={(code: string) => setOtp(code)}
            theme={{
              pinCodeContainerStyle: { width: 50, height: 48 },
              pinCodeTextStyle: {
                fontFamily: Font.textExtraLight,
                fontSize: 16,
              },
            }}
            textInputProps={{
              returnKeyType: 'done',
            }}
          />
        </View>

        {/* Resend OTP option */}
        <SingleLineComponent
          style={styles.resendContainer}
          text1={'Didn’t receive code? '}
          text2={'Resend again'}
          text1Click={handleSendOtp}
        />

        {/* Verify button */}
        <Button
          buttonName={'Verify'}
          loader={isPending}
          btnwidth={'100%'}
          onPress={() => {
            handleVerifyOtp();
          }}
          style={styles.verifyButton}
        />
      </View>
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
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInputContainer: {
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default VerificationScreen;
