import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import CustomText from '../../../common/CustomText';
import Header from '../../../common/Header';
import {Font} from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';

const AllOffers = () => {
  const Data = [
    {
      title: 'First 100',
      point: 'Get 10 points',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ',
    },
    {
      title: 'First 100',
      point: 'Get 2-5 points',
      des: '1 year =2 points, 5 years =5 points as regular',
    },
    {
      title: 'First 100',
      point: 'Get 10 points',
      des: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ',
    },
  ];

  interface ItemType {
    point: string;
    title: string;
    des: string;
  }

  const renderItem: ListRenderItem<ItemType> = ({item}) => {
    return (
      <View style={styles.mainview}>
        <View style={styles.pointview}>
          <CustomText style={styles.point}>{item.point}</CustomText>
        </View>
        <CustomText style={styles.title}>{item.title}</CustomText>
        <CustomText style={styles.desc}>{item.des}</CustomText>
      </View>
    );
  };
  return (
    <WrapperScreen>
      <Header title="All Offers " showBack />
      <View style={styles.container}>
        <FlatList
          data={Data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  mainview: {
    borderWidth: 1,
    padding: 10,
    borderColor: '#E1E1E1',
    borderRadius: 10,
  },
  desc: {
    color: '#5A5A5A',
    fontSize: 10,
    fontFamily: Font.textNormal,
  },
  title: {
    color: '#0A0203',
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
    marginVertical: 7,
  },
  point: {
    color: '#EDAE10',
    fontSize: 10,
    fontFamily: Font.textNormal,
  },
  pointview: {
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    borderRadius: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default AllOffers;
