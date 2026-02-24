import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const AddressSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="column" padding={10}>
        {[...Array(4)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            flexDirection="column"
            marginBottom={20}
            borderRadius={8}
            padding={15}>
            {/* Username */}
            <SkeletonPlaceholder.Item
              width={120}
              height={16}
              borderRadius={4}
              marginBottom={10}
            />

            {/* Address Line */}
            <SkeletonPlaceholder.Item
              width={'80%'}
              height={14}
              borderRadius={4}
              marginBottom={6}
            />
            <SkeletonPlaceholder.Item
              width={'60%'}
              height={14}
              borderRadius={4}
              marginBottom={6}
            />

            {/* Phone / identity */}
            <SkeletonPlaceholder.Item
              width={'40%'}
              height={14}
              borderRadius={4}
              marginTop={10}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default AddressSkeleton;
