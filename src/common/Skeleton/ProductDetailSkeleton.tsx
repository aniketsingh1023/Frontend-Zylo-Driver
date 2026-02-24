import React from 'react';
import {View, ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProductDetailsSkeleton = () => {
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <SkeletonPlaceholder borderRadius={8}>
        <>
          {/* Header */}
          <View
            style={{flexDirection: 'row', padding: 16, alignItems: 'center'}}>
            <View style={{width: 30, height: 30, borderRadius: 15}} />
            <View style={{width: 120, height: 20, marginLeft: 12}} />
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginLeft: 'auto',
              }}
            />
          </View>

          {/* Product Image */}
          <View style={{width: '100%', height: 250}} />

          {/* Size buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <View
              style={{
                width: 80,
                height: 35,
                borderRadius: 20,
                marginHorizontal: 8,
              }}
            />
            <View
              style={{
                width: 80,
                height: 35,
                borderRadius: 20,
                marginHorizontal: 8,
              }}
            />
            <View
              style={{
                width: 80,
                height: 35,
                borderRadius: 20,
                marginHorizontal: 8,
              }}
            />
          </View>

          {/* Description */}
          <View style={{paddingHorizontal: 16}}>
            <View style={{width: '90%', height: 14, marginBottom: 6}} />
            <View style={{width: '80%', height: 14, marginBottom: 6}} />
            <View style={{width: '70%', height: 14, marginBottom: 6}} />
          </View>

          {/* Price + Counter */}
          <View style={{padding: 16, marginTop: 30}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{width: 80, height: 20}} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 30, height: 30, borderRadius: 15}} />
                <View style={{width: 20, height: 20, marginHorizontal: 12}} />
                <View style={{width: 30, height: 30, borderRadius: 15}} />
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: 45,
                borderRadius: 10,
                marginTop: 20,
              }}
            />
          </View>
        </>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default ProductDetailsSkeleton;
