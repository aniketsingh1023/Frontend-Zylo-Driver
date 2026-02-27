import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { AuthStackParamList, OtpScreenParam } from '.';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import { SingleLineComponent } from '../../common/HelperComponent';
import { Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';
import { StackNavigationProp } from '@react-navigation/stack';

type MessageRequestDetailsRouteParam = RouteProp<
  AuthStackParamList,
  'OtpScreen'
>;
type NavigationProps = StackNavigationProp<AuthStackParamList, 'OtpScreen'>;
const OtpScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<MessageRequestDetailsRouteParam>();
  const pagename = route.params?.page;
  console.log(pagename);
  return (
    <WrapperScreen>
      <Header showBack />
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading>
            {pagename == 'signin'
              ? 'Verify via otp for signin'
              : ' Phone or Email verification'}
          </Heading>
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
          onPress={() => navigation.navigate('SetPasswordSignUpScreen')}
          style={styles.verifyButton}
        />
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  filledinput: {
    backgroundColor: '#FFFDE7',
    borderColor: '#F6CD56',
    borderWidth: 1,
  },
  container: {
    margin: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '80%',
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default OtpScreen;
