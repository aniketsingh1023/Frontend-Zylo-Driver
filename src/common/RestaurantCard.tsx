import {Image, TouchableOpacity, StyleSheet, View} from 'react-native';
import CustomText from './CustomText';
import {SVG} from './SvgHelper';
import FastImage from 'react-native-fast-image';

const RestaurantCard = ({image, name, distance, onPress}: any) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
    <FastImage source={{uri: image}} style={styles.cardImage} />
    <View style={styles.cardDetails}>
      <CustomText style={styles.cardTitle}>{name}</CustomText>
      <View style={styles.cardFooter}>
        <SVG.Ratings />
        <View style={styles.distanceContainer}>
          <SVG.LocationMinus color={'#A0A0A0'} />
          <CustomText style={styles.distanceText}>
            {`  ${distance} away`}
          </CustomText>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 217,
  },
  cardDetails: {
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 13,
    color: '#A0A0A0',
  },
});

export default RestaurantCard;
