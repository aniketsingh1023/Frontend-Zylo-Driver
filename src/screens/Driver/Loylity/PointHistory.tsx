import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomText from '../../../common/CustomText';
import Header from '../../../common/Header';
import {SVG} from '../../../common/SvgHelper';
import {Font} from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../auth';
import {useNavigation} from '@react-navigation/native';
type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DashboardScreen'
>;

const PointHistory = () => {
  const navigation = useNavigation<NavigationProps>();
  const Data = [
    {
      title: 'First 100',
      point: '10 points',
      date: 'Feb 16,2025',
    },
    {
      title: 'Period of stay (1 year)',
      point: '10 points',
      date: 'Feb 16,2025',
    },
    {
      title: 'Period of stay (1 year)',
      point: '2 points',
      date: 'Feb 15, 2025',
    },
    {
      title: 'First 100',
      point: '10 points',
      date: 'Feb 16,2025',
    },
    {
      title: 'First 100',
      point: '10 points',
      date: 'Feb 16,2025',
    },
    {
      title: 'First 100',
      point: '10 points',
      date: 'Feb 16,2025',
    },
  ];

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={[styles.point_view, styles.justify]}
        onPress={() => navigation.navigate('AllOffers')}>
        <View style={[styles.point_view]}>
          <SVG.Up_Aero />
          <View style={{marginLeft: 10}}>
            <CustomText style={styles.title}>{item.title}</CustomText>
            <CustomText style={styles.time}>{item.date}</CustomText>
          </View>
        </View>

        <CustomText style={styles.title}>{item.point}</CustomText>
      </TouchableOpacity>
    );
  };
  return (
    <WrapperScreen>
      <Header title="Point history " showBack />
      <View style={styles.container}>
        <FlatList data={Data} renderItem={renderItem} />
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#121212',
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
  },
  time: {
    color: '#5A5A5A',
    fontSize: 12,
    fontFamily: Font.textNormal,
  },
  justify: {
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FEC400',
    marginVertical: 7,
    padding: 7,
    borderRadius: 10,
  },
  point_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default PointHistory;
