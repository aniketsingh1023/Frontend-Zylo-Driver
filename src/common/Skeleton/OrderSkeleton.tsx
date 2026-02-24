import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const OrderListSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="column" padding={0}>
        {[...Array(4)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            marginBottom={20}
            // marginHorizontal={5}
            borderRadius={10}
            padding={10}
            borderWidth={1} // added border
            borderColor="#FEC400">
            {/* Order ID */}
            <SkeletonPlaceholder.Item
              width="60%"
              height={16}
              borderRadius={4}
            />
            {/* Placed by & Date */}
            <SkeletonPlaceholder.Item
              width="80%"
              height={14}
              borderRadius={4}
              marginTop={6}
            />
            <SkeletonPlaceholder.Item
              width="50%"
              height={14}
              borderRadius={4}
              marginTop={4}
            />

            {/* Shipping Address */}
            <SkeletonPlaceholder.Item
              width="90%"
              height={14}
              borderRadius={4}
              marginTop={10}
            />
            <SkeletonPlaceholder.Item
              width="85%"
              height={14}
              borderRadius={4}
              marginTop={4}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={14}
              borderRadius={4}
              marginTop={4}
            />

            {/* Items */}
            {[...Array(2)].map((_, idx) => (
              <SkeletonPlaceholder.Item
                key={idx}
                width="80%"
                height={14}
                borderRadius={4}
                marginTop={6}
              />
            ))}

            {/* Total & Status */}
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="space-between"
              marginTop={10}>
              <SkeletonPlaceholder.Item
                width="30%"
                height={16}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width="20%"
                height={16}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>

            {/* Payment Status */}
            <SkeletonPlaceholder.Item
              width="25%"
              height={14}
              borderRadius={4}
              marginTop={6}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default OrderListSkeleton;
