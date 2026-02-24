import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Font } from '../../common/Theam';
import { SVG } from '../../common/SvgHelper';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashProps = {
  navigation: StackNavigationProp<any, 'Splash'>;
};

const Splash: React.FC<SplashProps> = ({ navigation }: any) => {
  useEffect(() => {
    // const timer = setTimeout(() => {
    //   navigation.navigate('WelcomeScreen');
    //   // navigation.navigate('DriverAccountScreeen');
    // }, 3000);

    const timer = setTimeout(async () => {
      let token = await AsyncStorage.getItem('token');
      console.log('TOKEN ON LOGIN SCREEN--->', token);
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DriverHomeScreen' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'WelcomeScreen' }],
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.background}>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: Colors.default,
    fontFamily: Font.textNormal,
    fontSize: 60,
    textAlign: 'center',
  },
});

export default Splash;
