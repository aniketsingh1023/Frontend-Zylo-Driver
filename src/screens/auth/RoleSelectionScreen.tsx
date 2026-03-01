import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AuthStackParamList } from '.';
import Button from '../../common/Button';
import CustomText from '../../common/CustomText';
import Header from '../../common/Header';
import Heading from '../../common/Heading';
import { SVG } from '../../common/SvgHelper';
import { Colors, Font } from '../../common/Theam';
import WrapperScreen from '../../common/WrapperScreen';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'RoleSelectionScreen'
>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedRole, setSelectedRole] = useState<
    'driver' | 'restraunt' | null
  >(null);

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    if (selectedRole === 'driver') {
      navigation.navigate('LocationPermissionScreen');
    } else {
      // Customer flow - you can implement later
      navigation.navigate('SignUpScreen');
    }
  };

  return (
    <WrapperScreen>
      <Header
        showBack
        leftText="Back"
        onLeftPress={() => navigation.navigate('WelcomeScreen')}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Heading>Select Your Role</Heading>
          <CustomText style={styles.subtitle}>
            Choose how you want to use the app
          </CustomText>
        </View>

        <View style={styles.roleContainer}>
          {/* Driver Role */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'driver' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('driver')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <SVG.CarIcon width={60} height={60} />
            </View>
            <CustomText style={styles.roleTitle}>Driver</CustomText>
            <CustomText style={styles.roleDescription}>
              Deliver food and earn money
            </CustomText>
            {selectedRole === 'driver' && (
              <View style={styles.checkmark}>
                <SVG.GreenTick width={24} height={24} />
              </View>
            )}
          </TouchableOpacity>

          {/* Customer Role */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'restraunt' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('restraunt')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <SVG.Restraunt width={60} height={60} />
            </View>
            <CustomText style={styles.roleTitle}>Restraunt</CustomText>
            <CustomText style={styles.roleDescription}>
              Order food from restaurants
            </CustomText>
            {selectedRole === 'restraunt' && (
              <View style={styles.checkmark}>
                <SVG.GreenTick width={24} height={24} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          buttonName="Continue"
          btnwidth="100%"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  subtitle: {
    marginTop: 8,
    color: '#6B6B6B',
    fontSize: 14,
  },
  roleContainer: {
    flex: 1,
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: Colors.default,
    backgroundColor: '#FFF9E6',
  },
  roleIconContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontFamily: Font.textBolder,
    color: '#333333',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: Font.textNormal,
    color: '#6B6B6B',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  continueButton: {
    marginTop: 20,
  },
});

export default RoleSelectionScreen;
