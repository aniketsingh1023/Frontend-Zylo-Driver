import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import { AuthStackParamList } from '../../auth';
import WrapperScreen from '../../../common/WrapperScreen';
import Header from '../../../common/Header';
import { SVG } from '../../../common/SvgHelper';
import CustomText from '../../../common/CustomText';
import { Colors, Font } from '../../../common/Theam';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import { useGetCurrentDriverDetails } from '../../../data-access/queries/driver';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationScreen from '../../../common/LocationScreen';
import { useQueryClient } from '@tanstack/react-query';
import { ImageType } from '../../../api/types/authTypes';
import ImagePicker from 'react-native-image-crop-picker';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DashboardScreen'
>;

const DriverAccountEditScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProps>();
  const data = queryClient.getQueryData<any>(['currentDriverKey']);
  const [editable, setEditable] = useState(false);
  const [isOnline, setIsOnline] = useState(data?.isOnline || false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [profileImg, setProfileImg] = useState<ImageType | null>(null);

  const handleImagePicker = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 1050,
        height: 700,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
      });

      const selectedImage: ImageType = {
        name: img.filename || 'profileImage',
        uri: img.path,
        path: img.path,
        type: img.mime,
      };

      setProfileImg(selectedImage);
    } catch (err) {
      console.log('Image Picker Cancelled');
    }
  };

  return (
    <WrapperScreen>
      <Header showBack title={editable ? 'Edit Profile' : 'My Profile'} />
      <ScrollView contentContainerStyle={{ marginBottom: 40 }}>
        <View style={styles.container}>
          {/* Profile Section */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              <FastImage
                style={styles.profilePicture}
                source={
                  editable && profileImg
                    ? { uri: profileImg.path }
                    : data?.profilePicture?.url
                    ? { uri: data?.profilePicture?.url }
                    : require('../../../assets/image/other/DefaultImage.jpg')
                }
              />
              {editable && (
                <TouchableOpacity onPress={handleImagePicker}>
                  <SVG.CameraIcon style={styles.cameraIcon} />
                </TouchableOpacity>
              )}
            </View>
            <CustomText style={styles.profileName}>
              {data?.firstName} {data?.lastName}
            </CustomText>
          </View>

          {/* Profile Fields */}
          <Input
            editable={editable}
            placeholder="First Name"
            value={data?.firstName}
          />
          <Input
            editable={editable}
            placeholder="Last Name"
            value={data?.lastName}
          />
          <Input
            editable={false}
            placeholder="Mobile Number"
            value={data?.phoneNumber}
          />
          <Input editable={false} placeholder="Email" value={data?.email} />

          {/* Address Section */}
          {/* <TouchableOpacity
            onPress={() => setOpenLocationModal(true)}
            style={styles.locationButton}
          >
            <CustomText style={styles.locationText}>
              📍 Tap to fill address using map
            </CustomText>
          </TouchableOpacity> */}

          <Input
            placeholder="Street"
            value={data?.address?.streetAddress}
            editable={editable}
          />
          <Input
            placeholder="City"
            value={data?.address?.city}
            editable={editable}
          />
          <Input
            placeholder="State"
            value={data?.address?.state}
            editable={editable}
          />
          <Input
            placeholder="Country"
            value={data?.address?.country}
            editable={editable}
          />
          <Input
            placeholder="Zip Code"
            value={data?.address?.zipcode}
            editable={editable}
          />

          {/* Documents Section */}
          <CustomText style={styles.sectionHeader}>Documents</CustomText>
          <FlatList
            data={data?.documents}
            keyExtractor={item => item?.id}
            horizontal
            renderItem={({ item }: any) => (
              <View style={styles.docContainer}>
                <FastImage
                  source={{ uri: item?.url }}
                  style={styles.docImage}
                />
                <CustomText numberOfLines={1} style={styles.docInfo}>
                  Exp: {new Date(item?.documentExpiryDate).toLocaleDateString()}
                </CustomText>
              </View>
            )}
          />
          {/* Status Section */}
          <View style={styles.statusRow}>
            <CustomText style={styles.statusText}>Account status:</CustomText>
            <CustomText style={{ color: data?.isApproved ? 'green' : 'red' }}>
              {data?.isApproved ? 'Approved' : 'Pending'}
            </CustomText>
          </View>

          <View style={styles.statusRow}>
            <CustomText style={styles.statusText}>
              {isOnline ? 'Online' : 'Offline'}
            </CustomText>
            <TouchableOpacity
              style={[
                styles.statusToggle,
                isOnline ? styles.online : styles.offline,
                !editable && { opacity: 0.4 },
              ]}
              activeOpacity={0.7}
              disabled={!editable}
              onPress={() => setIsOnline(!isOnline)}
            >
              <View
                style={[
                  styles.toggleIndicator,
                  isOnline
                    ? { alignSelf: 'flex-end' }
                    : { alignSelf: 'flex-start' },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={{ paddingHorizontal: 20 }}>
        {editable ? (
          <Button
            buttonName="Save Changes"
            btnwidth="100%"
            onPress={() => {
              setEditable(false);
              console.log('Send Update API Here!');
            }}
          />
        ) : (
          <Button
            buttonName="Edit Profile"
            btnwidth="100%"
            onPress={() => setEditable(true)}
          />
        )}
      </View>
      {/* Location Modal */}
      <Modal
        isVisible={openLocationModal}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ marginTop: 0 }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <LocationScreen
            fieldName={'location'}
            setopenLocationModal={setOpenLocationModal}
            setLocationDetails={() => {}}
          />
        </SafeAreaView>
      </Modal>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  profilePictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#D0D0D0',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  profileName: {
    marginTop: 12,
    fontSize: 22,
    fontFamily: Font.textSemiBolder,
    color: '#333',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  statusLabel: { color: '#444', fontSize: 16 },

  sectionHeader: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: Font.textSemiBolder,
  },

  docContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#007aff',
  },

  docImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },

  docInfo: {
    fontSize: 12,
    marginTop: 5,
    width: 80,
    textAlign: 'center',
  },
  statusToggle: {
    width: 60,
    height: 28,
    borderRadius: 20,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  online: {
    backgroundColor: '#4CAF50',
  },

  offline: {
    backgroundColor: '#D9534F',
  },

  toggleIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },

  statusText: {
    fontSize: 16,
    fontFamily: Font.textSemiBolder,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 10,
  },
  locationButton: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default DriverAccountEditScreen;
