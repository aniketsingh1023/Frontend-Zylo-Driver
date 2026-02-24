import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import WrapperScreen from '../../../common/WrapperScreen';
import Header from '../../../common/Header';
import CustomText from '../../../common/CustomText';
import {SVG} from '../../../common/SvgHelper';
import {Font} from '../../../common/Theam';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../auth';

type NavigationProps = StackNavigationProp<AuthStackParamList, 'DriverLoyalty'>;

const DriverLoyalty = () => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <WrapperScreen>
      <Header title="Loyalty membership" showBack />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.pointview}
          onPress={() => navigation.navigate('PointHistory')}>
          <View style={[styles.flexdirex, styles.justfy]}>
            <View style={styles.flexdirex}>
              <SVG.Points />
              <CustomText style={styles.amount}>1200</CustomText>
              <CustomText style={styles.point_text}>Points</CustomText>
            </View>
            <CustomText style={styles.history}>Point history</CustomText>
          </View>
          <View style={[styles.flexdirex]}>
            <SVG.Information />
            <CustomText style={styles.offersy}>Know all the offersy</CustomText>
          </View>
        </TouchableOpacity>
        <CustomText style={styles.Offers}>Loyalty Offers</CustomText>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../../../assets/image/other/Loyalty.png')} />
        </View>
        <CustomText style={styles.Offers}>Current Progress</CustomText>

        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/image/other/Frame2610136.png')}
          />
        </View>
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  Offers: {
    color: '#0A0203',
    fontSize: 16,
    fontFamily: Font.textSemiBolder,
    marginVertical: 15,
  },
  amount: {
    color: '#FEC400',
    fontSize: 22,
    fontFamily: Font.textSemiBolder,
    marginLeft: 5,
  },
  point_text: {
    color: '#FEC400',
    fontSize: 12,
    fontFamily: Font.textNormal,
    marginLeft: 5,
  },
  history: {
    color: '#6B6B6B',
    fontSize: 13,
    fontFamily: Font.textNormal,
  },
  offersy: {
    color: '#6B6B6B',
    fontSize: 14,
    fontFamily: Font.textNormal,
    marginLeft: 5,
  },
  justfy: {justifyContent: 'space-between'},
  flexdirex: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pointview: {
    borderWidth: 1,
    borderColor: '#C9C9C9',
    borderRadius: 15,
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default DriverLoyalty;
