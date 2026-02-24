import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthStackParamList, ForgotPasswordParam } from '.';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import Input from '../../common/Input';
import { SVG } from '../../common/SvgHelper';
import { Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';
import { errorToast, infoToast, successToast } from '../../components/toasts';
import { useResetPasswordApi } from '../../data-access/mutations/auth';
import { extractErrorMessage } from '../../utils/helper';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'SetPasswordForgotScreen'
>;
type ForgotPasswordRouteParam = RouteProp<
  AuthStackParamList,
  'SetPasswordForgotScreen'
>;
const SetPasswordForgotScreen: React.FC<ForgotPasswordParam> = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ForgotPasswordRouteParam>();
  const email = route.params?.email;
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const { mutate: resetPassword, isPending } = useResetPasswordApi();

  const handleResetPassword = async () => {
    try {
      if (email.trim() === '') {
        infoToast('Email is required.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        infoToast('Please enter a valid email address.');
        return;
      }
      if (newPassword.trim() === '') {
        infoToast('New Password is required.');
        return;
      }
      if (confirmPassword.trim() === '') {
        infoToast('Confirm Password is required.');
        return;
      }
      if (newPassword !== confirmPassword) {
        infoToast('Password and Confirm Password must be same.');
        return;
      }
      resetPassword(
        { email, newPassword, confirmPassword },
        {
          onSuccess: async response => {
            console.log(response);

            if (response?.remote === 'success') {
              successToast('Password Reset Successfully');
              navigation.navigate('SignInScreen');
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

  return (
    <WrapperScreen>
      <Header showBack />
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading>Set password</Heading>
          <CustomText>Set your password</CustomText>
        </View>

        <Input
          placeholder="Enter Your Password"
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          rightButton={<SVG.HideEye />}
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          rightButton={<SVG.HideEye />}
        />
        <CustomText style={styles.passwordHint}>
          At least 1 number or a special character
        </CustomText>

        <Button
          buttonName="SAVE"
          loader={isPending}
          btnwidth="100%"
          onPress={handleResetPassword}
          style={styles.registerButton}
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
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordHint: {
    fontSize: 12,
    marginVertical: 10,
  },
  registerButton: {
    marginVertical: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalHeading: {
    fontFamily: Font.textSemiBolder,
    color: '#2A2A2A',
    fontSize: 22,
  },
  modalDescription: {
    fontSize: 12,
    fontFamily: Font.textBolder,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },
});

export default SetPasswordForgotScreen;
