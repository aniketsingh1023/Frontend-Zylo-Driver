import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthStackParamList } from '.';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import Input from '../../common/Input';
import WrapperScreen from '../../common/WrapperScreen';
import { errorToast, infoToast, successToast } from '../../components/toasts';
import { useForgotPasswordSendOtpApi } from '../../data-access/mutations/auth';
import { extractErrorMessage } from '../../utils/helper';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'ForgotPasswordScreen'
>;
// const VerificationScreen = () => {
const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const { mutate: sendOtp, isPending } = useForgotPasswordSendOtpApi();
  const [email, setemail] = useState('');

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
      {/* Header Section */}
      <Header showBack={true} />

      {/* Content Section */}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Heading>Forgot Password</Heading>
          <CustomText>Enter your registered email to receive OTP</CustomText>
        </View>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          maxLength={100}
          value={email}
          onChangeText={text => setemail(text)}
        />
      </View>

      {/* Button Section */}
      <Button
        buttonName="Send OTP"
        loader={isPending}
        btnwidth="90%"
        onPress={() => {
          handleSendOtp();
        }}
        style={styles.button}
      />
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '70%',
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 20,
  },
});

export default ForgotPasswordScreen;
