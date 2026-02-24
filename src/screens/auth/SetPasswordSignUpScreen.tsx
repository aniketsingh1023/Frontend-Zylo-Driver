import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AuthStackParamList } from '.';
import { UserType } from '../../api/types/userTypes';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import Input from '../../common/Input';
import PopUp from '../../common/PopUp';
import { SVG } from '../../common/SvgHelper';
import { Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';
import { infoToast } from '../../components/toasts';
import { storeUserDetails } from '../../Redux/Reducer/UserinfoReducer';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'SetPasswordSignUpScreen'
>;

const SetPasswordSignUpScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch();
  const userState: UserType = useSelector(
    (state: any) => state?.Userinfo?.user,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setpassword] = useState(userState?.password || '');
  const [confPassword, setconfPassword] = useState(userState?.password || '');

  const buttonPresh = () => {
    if (password.trim() === '' && confPassword.trim() === '') {
      infoToast('Password is required.');
      return;
    }
    if (password.trim() != confPassword.trim()) {
      infoToast('Password must match.');
      return;
    }
    dispatch(
      storeUserDetails({
        ...userState,
        password: password,
      }),
    );
    navigation.navigate('Personalinformation');
  };
  useEffect(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <WrapperScreen>
      <Header showBack leftText="Back" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading>Set password</Heading>
          <CustomText>Set your password</CustomText>
        </View>

        <Input
          placeholder="Enter Your Password"
          rightButton={<SVG.HideEye />}
          value={password}
          onChangeText={text => setpassword(text)}
        />
        <Input
          placeholder="Confirm Password"
          rightButton={<SVG.HideEye />}
          value={confPassword}
          onChangeText={text => setconfPassword(text)}
        />
        <CustomText style={styles.passwordHint}>
          At least 1 number or a special character
        </CustomText>

        <Button
          buttonName="Register"
          btnwidth="100%"
          onPress={() => buttonPresh()}
          style={styles.registerButton}
        />

        <PopUp
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        >
          <View style={styles.modalContent}>
            <SVG.GreenTick />
            <View style={styles.modalTextContainer}>
              <CustomText style={styles.modalHeading}>
                Enable your location
              </CustomText>
              <CustomText style={styles.modalDescription}>
                Your account is ready to use. You will be {'\n'}
                redirected to the Home Page in a few {'\n'}
                seconds.
              </CustomText>
            </View>
          </View>
        </PopUp>
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

export default SetPasswordSignUpScreen;
