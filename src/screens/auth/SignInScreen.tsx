import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { AuthStackParamList } from '.';
import { logoutUserInfoRedux } from '../../Redux/Reducer/UserinfoReducer';
import { logoutLoadingRedux } from '../../Redux/Reducer/loadingRedux';
import { IDriverSignInPayload } from '../../api/types/authTypes';

import Button from '../../common/Button';
import CommonScrollView from '../../common/CommonScrollView';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import { SingleLineComponent } from '../../common/HelperComponent';
import Input from '../../common/Input';
import { SVG } from '../../common/SvgHelper';
import WrapperScreen from '../../common/WrapperScreen';
import { errorToast, infoToast, successToast } from '../../components/toasts';
import { useSignIn } from '../../data-access/mutations/auth';
import { extractErrorMessage, setLocalStorage } from '../../utils/helper';
import { useGetCurrentDriverDetails } from '../../data-access/queries/driver';

type NavigationProps = StackNavigationProp<AuthStackParamList, 'SignInScreen'>;

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const { mutate: signIn, isPending } = useSignIn();
  const { refetch: refetchCurrentDriverDetails } = useGetCurrentDriverDetails();

  const loading = useSelector((state: any) => state.loading.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) return infoToast('Email or phone is required.');
    if (!password.trim()) return infoToast('Password is required.');

    const payload: IDriverSignInPayload = isNaN(Number(email))
      ? { email, password }
      : { phoneNumber: email, password };

    signIn(payload, {
      onSuccess: async response => {
        console.log(response);

        if (response?.remote === 'success') {
          const token = response?.data?.token;
          if (!token) throw new Error('Token missing');
          console.log('Login successful:', response);

          successToast('Login successful');
          await setLocalStorage('token', token);
          refetchCurrentDriverDetails();

          navigation.navigate('DriverHomeScreen');
        } else {
          errorToast(extractErrorMessage(response));
        }
      },
    });
  };

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('token');
      dispatch(logoutLoadingRedux());
      dispatch(logoutUserInfoRedux());
    };
    logout();
  }, []);

  return (
    <WrapperScreen>
      <Header
        showBack
        title="Sign In"
        onLeftPress={() => navigation.navigate('WelcomeScreen')}
      />

      <CommonScrollView>
        <View style={styles.container}>
          <Heading style={styles.heading}>Sign in</Heading>

          <Input
            placeholder="Email or Phone Number"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightButton={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <SVG.HideEye /> : <SVG.HideEye />}
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <CustomText style={styles.forgotPasswordText}>
              Forget password?
            </CustomText>
          </TouchableOpacity>

          <Button
            loader={isPending}
            buttonName="Sign In"
            btnwidth="100%"
            onPress={handleLogin}
            style={styles.signInButton}
          />

          <View style={styles.extraOptions}>



            <SingleLineComponent
              text1="Already have an account? "
              text2="Sign Up"
              text1Click={() => navigation.navigate('SignUpScreen')}
            />
          </View>
        </View>
      </CommonScrollView>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'flex-start',
    height: '80%',
  },
  heading: {
    marginBottom: 10,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#F44336',
    fontFamily: 'Font.textSemiBolder',
  },
  signInButton: {
    marginVertical: 20,
  },
  extraOptions: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orLine: {
    marginVertical: 15,
  },
  socialIcon: {
    marginVertical: 15,
  },
});

export default SignInScreen;
