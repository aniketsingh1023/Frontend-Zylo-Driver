import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../../common/CustomText';
import {Colors, Font} from '../../../common/Theam';
import WrapperScreen from '../../../common/WrapperScreen';
import Footer from '../../../common/Footer';
import SearchBar from '../../../common/SearchBar';
import {useState} from 'react';
import {SVG} from '../../../common/SvgHelper';
import Header from '../../../common/Header';
import DeriverFooter from '../../../common/DeriverFooter';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type AuthStackParamList = {
  // Governmentid: undefined;
};

type DriverHistoryScreenProps = NativeStackScreenProps<AuthStackParamList>;

const DriverHistoryScreen = ({navigation}: DriverHistoryScreenProps) => {
  const [Activebuton, setActivebutton] = useState(true);

  const Data = [
    {
      from: 'Gbagi market, Iwo road',
      tolocaton: 'Tulip Pharmacy, Oluwo',
      amount: '$8.50',
      time: '12:59pm 29/05',
    },
    {
      from: 'Gbagi market, Iwo road',
      tolocaton: 'Tulip Pharmacy, Oluwo',
      amount: '$8.50',
      time: '12:59pm 29/05',
    },
    {
      from: 'Gbagi market, Iwo road',
      tolocaton: 'Tulip Pharmacy, Oluwo',
      amount: '$8.50',
      time: '12:59pm 29/05',
    },
    {
      from: 'Gbagi market, Iwo road',
      tolocaton: 'Tulip Pharmacy, Oluwo',
      amount: '$8.50',
      time: '12:59pm 29/05',
    },
  ];

  interface ItemType {
    from: string;
    tolocaton: string;
    amount: string;
    time: string;
  }

  const renderItem: ListRenderItem<ItemType> = item => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#FEC400',
          marginVertical: 10,
          padding: 10,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <SVG.Currentlocation />
            <SVG.Location />
          </View>
          <View
            style={{
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '70%',
              marginLeft: 10,
            }}>
            <CustomText style={styles.address}>
              Gbagi market, Iwo road
            </CustomText>
            <CustomText style={styles.address}>
              Tulip Pharmacy, Oluwo
            </CustomText>
          </View>

          <CustomText style={styles.price}>$8.50</CustomText>
        </View>

        <CustomText style={styles.time}>12:59pm 29/05</CustomText>
      </View>
    );
  };
  const renderItemnew: ListRenderItem<ItemType> = item => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#FEC400',
          marginVertical: 10,
          padding: 10,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <SVG.Currentlocation />
            <SVG.Location />
          </View>
          <View
            style={{
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '70%',
              marginLeft: 10,
            }}>
            <CustomText style={styles.address}>
              Gbagi market, Iwo road
            </CustomText>
            <CustomText style={styles.address}>
              Tulip Pharmacy, Oluwo
            </CustomText>
          </View>

          <CustomText style={[styles.price, {color: '#CC0000'}]}>
            $8.50
          </CustomText>
        </View>

        <CustomText style={styles.time}>12:59pm 29/05</CustomText>
      </View>
    );
  };

  return (
    <WrapperScreen>
      <Header title="History" showBack />

      <View style={styles.container}>
        <SearchBar Filter={() => {}} />

        <View style={styles.buttonview}>
          <TouchableOpacity
            style={Activebuton ? styles.activebuttonstyle : styles.commanstyle}
            onPress={() => setActivebutton(true)}>
            <CustomText
              style={[
                styles.buttontext,
                {color: Activebuton ? '#FFFFFF' : '#5A5A5A'},
              ]}>
              Completed
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={!Activebuton ? styles.activebuttonstyle : styles.commanstyle}
            onPress={() => setActivebutton(false)}>
            <CustomText
              style={[
                styles.buttontext,
                {color: !Activebuton ? '#FFFFFF' : '#5A5A5A'},
              ]}>
              Cancelled
            </CustomText>
          </TouchableOpacity>
        </View>

        {Activebuton ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={Data}
            renderItem={renderItemnew}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <DeriverFooter />
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  time: {
    color: '#2A2A2A',
    fontSize: 14,
    fontFamily: Font.textNormal,
    marginTop: 10,
  },
  price: {color: '#158E3E', fontSize: 14, fontFamily: Font.textSemiBolder},
  address: {color: '#2A2A2A', fontSize: 14, fontFamily: Font.textNormal},
  buttontext: {
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
  },
  activebuttonstyle: {
    backgroundColor: '#FEC400',
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  commanstyle: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  buttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FEC400',
    height: 60,
    borderRadius: 10,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default DriverHistoryScreen;
