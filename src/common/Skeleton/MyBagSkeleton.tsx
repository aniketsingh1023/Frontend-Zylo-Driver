import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import React from 'react';
import {View} from 'react-native';

const BasketSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="column" padding={10}>
        {[...Array(5)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            flexDirection="row"
            alignItems="center"
            marginBottom={20}>
            {/* Image placeholder */}
            <SkeletonPlaceholder.Item
              width={100}
              height={100}
              borderRadius={20}
              marginRight={10}
            />

            {/* Text placeholders */}
            <SkeletonPlaceholder.Item flex={1}>
              <SkeletonPlaceholder.Item
                width={'60%'}
                height={15}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={'40%'}
                height={15}
                borderRadius={4}
                marginTop={6}
              />
              <SkeletonPlaceholder.Item
                width={'30%'}
                height={15}
                borderRadius={4}
                marginTop={6}
              />
            </SkeletonPlaceholder.Item>

            {/* Price placeholder */}
            <SkeletonPlaceholder.Item width={50} height={15} borderRadius={4} />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default BasketSkeleton;
