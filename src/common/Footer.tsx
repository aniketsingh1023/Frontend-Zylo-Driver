import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SVG } from './SvgHelper';
import { Font } from './Theam';
import CustomText from './CustomText';

// Define Props Type
interface FooterProps {
  isServices?: boolean;
  isAccount?: boolean;
  isHome?: boolean;
  isBooking?: boolean;
  isChat?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  isServices,
  isAccount,
  isHome,
  isBooking,  
  isChat,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => {
          navigation.navigate('DashboardScreen' as never);
        }}>
        {isHome ? <SVG.SelectedHome /> : <SVG.Home />}
        <CustomText style={[styles.fontstyle, { color: isHome ? '#22272B' : '#6B6B6B' }]}>
          Home
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconSection}>
        {isServices ? <SVG.SelectedServices /> : <SVG.Services />}
        <CustomText style={[styles.fontstyle, { color: isServices ? '#22272B' : '#6B6B6B' }]}>
          Services
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => {
          navigation.navigate('BookingScreen' as never);
        }}>
        {isBooking ? <SVG.SelectedBooking /> : <SVG.Booking />}
        <CustomText style={[styles.fontstyle, { color: isBooking ? '#22272B' : '#6B6B6B' }]}>
          Bookings
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconSection}
        onPress={() => {
          navigation.navigate('AccountHomeScreen' as never);
        }}>
        {isAccount ? <SVG.SelectedAccount /> : <SVG.Account />}
        <CustomText style={[styles.fontstyle, { color: isAccount ? '#22272B' : '#6B6B6B' }]}>
          Account
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fontstyle: {
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

export default Footer;
