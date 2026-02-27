import React from 'react';
import {StyleSheet, View} from 'react-native';
import WrapperScreen from '../../common/WrapperScreen';
import {SVG} from '../../common/SvgHelper';
import Button from '../../common/Button';

const Welcome = ({navigation}) => {
  return (
    <WrapperScreen>
      <View style={styles.logoContainer}>
        <SVG.Logo />
        <View style={styles.welcomeTextContainer}>
          <SVG.WelcomeText />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonName="Create an account"
          btnwidth="100%"
          onPress={() => navigation.navigate('RoleSelectionScreen')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          buttonName="Sign In"
          btnwidth="90%"
          bgcolor="white"
          btncolor="#EDAE10"
          btnborder={1}
          bordercolor="#EDAE10"
          onPress={() => navigation.navigate('SignInScreen')}
        />
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
  },
  welcomeTextContainer: {
    marginTop: '20%',
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 40,
  },
  buttonSpacing: {
    marginTop: 20,
  },
});

export default Welcome;
