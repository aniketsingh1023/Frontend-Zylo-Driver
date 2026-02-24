import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomText from '../../../common/CustomText';
import DeriverFooter from '../../../common/DeriverFooter';
import { Font } from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { SVG } from '../../../common/SvgHelper';
import { logoutLoadingRedux } from '../../../Redux/Reducer/loadingRedux';
import { logoutUserInfoRedux } from '../../../Redux/Reducer/UserinfoReducer';
import { AuthStackParamList } from '../../auth';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DriverAccountScreeen'
>;
const DriverAccountScreeen = () => {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const options = [
    { id: 'DriverAccountEditScreen', value: 'My Profile' },
    { id: 'AccountVehicleScreen', value: 'My Vehicle' },
    // { id: 'AccountTransactionScreen', value: 'My Documents' },
    { id: 'DriverLoyalty', value: 'Loyalty membership' },
    // {id: 'AccountSaveCardsScreen', value: 'Saved Cards'},
    { id: 'PrivacyPolicyScreen', value: 'Privacy Policy' },
    { id: 'HelpSupportScreen', value: 'Help & Support' },
    { id: 'DeleteAccountScreen', value: 'Delete Account' },
    { id: 'SignInScreen', value: 'Logout' },
  ];

  return (
    <WrapperScreen>
      <View
        style={{
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}
      >
        <CustomText
          style={{
            fontSize: 24,
            fontFamily: Font.textBolder,
            color: '#2A2A2A',
          }}
        >
          My Account
        </CustomText>
      </View>
      <View style={styles.container}>
        {/* <CustomText style={styles.header}>Account</CustomText> */}
        <View style={styles.card}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={async () => {
                if (option.id === 'SignInScreen') {
                  await AsyncStorage.removeItem('token');
                  dispatch(logoutLoadingRedux());
                  dispatch(logoutUserInfoRedux());
                  queryClient.clear();
                  queryClient.cancelQueries();
                  queryClient.resetQueries();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignInScreen' }],
                  });
                } else {
                  navigation.navigate(option.id as never);
                }
              }}
            >
              <Text style={styles.optionText}>{option.value}</Text>
              <SVG.RightArrow />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <DeriverFooter isAccount />
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Font.textSemiBolder,
    marginVertical: 20,
    color: '#000000',
  },
  card: {},
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 0.5,
    borderColor: '#FEC400',
    borderRadius: 8,
    marginVertical: 10,
    height: 51,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
    // fontFamily: Font.textSemiBolder,
  },
  arrow: {
    fontSize: 16,
    color: '#000',
  },
});

export default DriverAccountScreeen;
