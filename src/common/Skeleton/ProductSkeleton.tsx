import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const ProductSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <View style={{flexDirection: 'row', marginVertical: 10, padding: 10}}>
        {/* Image */}
        <View style={{width: 100, height: 100, borderRadius: 8}} />

        {/* Middle Texts */}
        <View style={{flex: 3, marginLeft: 10, justifyContent: 'center'}}>
          <View style={{width: '70%', height: 15, marginBottom: 8}} />
          <View style={{width: '50%', height: 12}} />
        </View>

        {/* Price */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{width: 50, height: 15}} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};
