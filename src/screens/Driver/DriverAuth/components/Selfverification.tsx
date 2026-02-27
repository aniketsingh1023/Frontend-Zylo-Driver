import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Image, Platform} from 'react-native';
import Button from '../../../../common/Button';
import CustomText from '../../../../common/CustomText';
import {SVG} from '../../../../common/SvgHelper';
import {Font} from '../../../../common/Theam';
import WrapperScreen from '../../../../common/WrapperScreen';
import {AuthStackParamList} from '../../../auth';
import {ImageType} from '../../../../api/types/authTypes';
import ImagePicker from 'react-native-image-crop-picker';

type NavigationProps = StackNavigationProp<
  AuthStackParamList,
  'DashboardScreen'
>;

const Selfverfication = ({
  setImage,
  image,
}: {
  setImage: (image: ImageType | null) => void;
  image: ImageType | null;
}) => {
  const navigation = useNavigation<NavigationProps>();

  const checklist = [
    {
      id: 1,
      title: 'Please upload a clear selfie.',
    },
    {
      id: 2,
      title: 'The Selfie should have the applicant\'s face alone.',
    },
    {
      id: 3,
      title: 'Upload JPEG/PNG format only.',
    },
  ];

  const handleImagePicker = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 600,
        height: 600,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'any',
        compressImageQuality: 0.5,
        compressImageMaxWidth: 600,
        compressImageMaxHeight: 600,
      });

      const selectedImage: ImageType = {
        name: img.filename || 'selfie',
        uri: img.path,
        path: img.path,
        type: img.mime || 'image/jpeg',
      };

      setImage(selectedImage);
    } catch (err) {
      console.log('Image Picker Cancelled');
    }
  };

  return (
    <WrapperScreen>
      <View style={styles.container}>
        {checklist.map(item => {
          return (
            <View
              key={item.id}
              style={styles.checkItem}>
              <SVG.CheckedIcon height={20} width={20} />
              <CustomText style={styles.checktitle}>{item.title}</CustomText>
            </View>
          );
        })}
        <TouchableOpacity
          style={styles.chooseimage}
          onPress={handleImagePicker}>
          {image ? (
            <View style={styles.previewContainer}>
              <Image
                source={{uri: image.uri}}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <CustomText style={styles.changeText}>Tap to change</CustomText>
            </View>
          ) : (
            <>
              <SVG.Uploadicon />
              <CustomText style={styles.Upload}>Upload Selfie</CustomText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </WrapperScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  Upload: {
    color: '#333333',
    fontSize: 16,
    fontFamily: Font.textSemiBolder,
    marginTop: 15,
  },
  chooseimage: {
    backgroundColor: '#EDAE104D',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#EDAE101A',
    marginVertical: 20,
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  changeText: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: Font.textSemiBolder,
  },
  checktitle: {
    fontSize: 12,
    fontFamily: Font.textSemiBolder,
    color: '#6B6B6B',
    marginLeft: 10,
  },
});

export default Selfverfication;
