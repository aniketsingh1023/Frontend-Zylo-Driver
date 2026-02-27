import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import LocationPermissionScreen from './LocationPermissionScreen';
import OtpScreen from './OtpScreen';
import ProfileScreen from './ProfileScreen';
import SetPasswordForgotScreen from './SetPasswordForgotScreen';
import SetPasswordSignUpScreen from './SetPasswordSignUpScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import Splash from './Splash';
import VerificationScreen from './VerificationScreen';
import Welcome from './WelcomeScreen';
import RoleSelectionScreen from './RoleSelectionScreen';

/////jitendra//
import Drivinglicense from '../Driver/DriverAuth/components/Drivinglicense';
import Governmentid from '../Driver/DriverAuth/components/Governmentid';
import Selfverfication from '../Driver/DriverAuth/components/Selfverification';
import Personalinformation from '../Driver/DriverAuth/Personalinformation';
import DriverHistoryScreen from '../Driver/History/DriverHistoryScreen';

/////Driver component ///
import { IAddress } from '../../api/types/userTypes';
import AccountVehicleScreen from '../Driver/Account/AccountVehicleScreen';
import DriverAccountEditScreen from '../Driver/Account/DriverAccountEditScreen';
import DriverAccountScreeen from '../Driver/Account/DriverAccountScreeen';
import DriverHomeScreen from '../Driver/Home/DriverHomeScreen';
import AllOffers from '../Driver/Loylity/AllOfffers';
import DriverLoyalty from '../Driver/Loylity/DriverLoylity';
import PointHistory from '../Driver/Loylity/PointHistory';
export type ForgotPasswordParam = {
  email: string;
  password?: string;
};
export type OtpScreenParam = {
  page: string;
};
export type AddAddressParam = {
  initialValue?: IAddress;
};
export type TrackOrderParam = {
  orderId: string;
};
export type RestaurantDetailParam = {
  restaurantId: string;
};

// Define type for navigation stack
export type AuthStackParamList = {
  SplashScreen: undefined;
  DashboardScreen: { page: string } | undefined;
  WelcomeScreen: undefined;
  RoleSelectionScreen: undefined;
  RideScreen: undefined;
  LocationPermissionScreen: undefined;
  SignUpScreen: undefined;
  SetPasswordSignUpScreen: undefined;
  SetPasswordForgotScreen: ForgotPasswordParam;
  SignInScreen: undefined;
  VerificationScreen: ForgotPasswordParam;
  ProfileScreen: undefined;
  OtpScreen: OtpScreenParam;
  ForgotPasswordScreen: undefined;
  PopularRestaurantScreen: undefined;
  RestaurantDetailScreen: RestaurantDetailParam;
  ProductDetailsScreen: undefined;
  MyBag: undefined;
  Address: undefined;
  AddAddress: AddAddressParam;
  Payment: undefined;
  Paymentsuccess: undefined;
  TrackOrder: TrackOrderParam;
  Feedback: undefined;
  Personalinformation: undefined;
  Selfverfication: undefined;
  Drivinglicense: undefined;
  Governmentid: undefined;
  DriverAccountScreeen: undefined;
  DriverAccountEditScreen: undefined;
  AccountVehicleScreen: undefined;
  DriverHistoryScreen: undefined;
  DriverHomeScreen: undefined;
  DriverLoyalty: undefined;
  PointHistory: undefined;
  AllOffers: undefined;
};

// Define AuthStack
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator initialRouteName="SplashScreen">
      <AuthStack.Screen
        name="SplashScreen"
        component={Splash}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="WelcomeScreen"
        component={Welcome}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="RoleSelectionScreen"
        component={RoleSelectionScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="LocationPermissionScreen"
        component={LocationPermissionScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SetPasswordSignUpScreen"
        component={SetPasswordSignUpScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SetPasswordForgotScreen"
        component={SetPasswordForgotScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />

      {/* <AuthStack.Screen
        name="MainScreen"
        component={TabNavigator}
        options={{headerShown: false}}
      /> */}

      <AuthStack.Screen
        name="Personalinformation"
        component={Personalinformation}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Selfverfication"
        component={Selfverfication}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Drivinglicense"
        component={Drivinglicense}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Governmentid"
        component={Governmentid}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="DriverAccountScreeen"
        component={DriverAccountScreeen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="DriverAccountEditScreen"
        component={DriverAccountEditScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="AccountVehicleScreen"
        component={AccountVehicleScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="DriverHistoryScreen"
        component={DriverHistoryScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="DriverHomeScreen"
        component={DriverHomeScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="DriverLoyalty"
        component={DriverLoyalty}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="PointHistory"
        component={PointHistory}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="AllOffers"
        component={AllOffers}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AuthNavigator;
