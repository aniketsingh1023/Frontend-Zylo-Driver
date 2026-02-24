import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { SVG } from './SvgHelper';
import { Colors, Font } from './Theam';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define Navigation Stack Type (Modify according to your navigation setup)
type RootStackParamList = {
  DriverHomeScreen: undefined;
  DriverHistoryScreen: undefined;
  DriverAccountScreeen: undefined;
};

// Define Props for the Footer Component
interface DriverFooterProps {
  isHistory?: boolean;
  isAccount?: boolean;
  isHome?: boolean;
  isBooking?: boolean;
  isChat?: boolean;
}

const DriverFooter: React.FC<DriverFooterProps> = ({
  isHistory = false,
  isAccount = false,
  isHome = false,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => navigation.navigate('DriverHomeScreen')}
      >
        {isHome ? <SVG.SelectedHome /> : <SVG.Home />}
        <CustomText style={[styles.fontStyle, { color: isHome ? '#22272B' : '#6B6B6B' }]}>
          Home
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => navigation.navigate('DriverHistoryScreen')}
      >
        {isHistory ? <SVG.SelectedServices /> : <SVG.Services />}
        <CustomText style={[styles.fontStyle, { color: isHistory ? '#22272B' : '#6B6B6B' }]}>
          History
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => navigation.navigate('DriverAccountScreeen')}
      >
        {isAccount ? <SVG.SelectedAccount /> : <SVG.Account />}
        <CustomText style={[styles.fontStyle, { color: isAccount ? '#22272B' : '#6B6B6B' }]}>
          Account
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fontStyle: {
    fontSize: 12,
    fontFamily: Font.textNormal,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DriverFooter;
