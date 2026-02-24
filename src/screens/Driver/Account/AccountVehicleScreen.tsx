import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import { Colors, Font } from '../../../common/Theam';
import { ImageType } from '../../../api/types/authTypes';
import CustomText from '../../../common/CustomText';
import { SVG } from '../../../common/SvgHelper';
import Header from '../../../common/Header';
import ImagePicker from 'react-native-image-crop-picker';
import { IVehicleFormPayload } from '../../../api/types/riderTypes';
import { useAddVehicle } from '../../../data-access/mutations/driver';
import { errorToast, successToast } from '../../../components/toasts';
import { extractErrorMessage } from '../../../utils/helper';
import DatePicker from 'react-native-date-picker';
import { useGetVehicleInfo } from '../../../data-access/queries/driver';

const emptyVehicle: IVehicleFormPayload = {
  displayImage: null,
  make: '',
  model: '',
  year: '',
  licensePlate: '',
  color: '',
  vinNumber: '',
  seatingCapacity: '',
  documents: [
    // {
    //   file: null,
    //   documentNumber: '',
    //   documentExpiryDate: '',
    // },
  ],
};

const AccountVehicleScreen: React.FC = () => {
  const [vehicle, setVehicle] = useState<IVehicleFormPayload | null>(null);
  const { data: vehicleData, isLoading } = useGetVehicleInfo();
  const { mutate: addVehicle } = useAddVehicle();
  const [form, setForm] = useState<IVehicleFormPayload>(emptyVehicle);
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onChange = (key: keyof IVehicleFormPayload, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    console.log('form', JSON.stringify(form, null, 2));

    setVehicle(form);
    addVehicle(form, {
      onSuccess: async response => {
        if (response?.remote === 'success') {
          successToast('Vehicle added successfully');
        } else {
          errorToast(extractErrorMessage(response));
        }
      },
    });
    setIsEditing(false);
  };

  const onEdit = () => {
    if (vehicle) {
      setForm(vehicle);
      setIsEditing(true);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (v: string) => void,
  ) => (
    <View style={styles.inputWrapper}>
      <CustomText style={styles.label}>{label}</CustomText>
      <TextInput
        value={value}
        editable={label == 'Expiry Date' ? false : true}
        onChangeText={onChangeText}
        style={styles.input}
        placeholder={label}
        onPress={
          label == 'Expiry Date'
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      />
    </View>
  );

  const handleImagePicker = async () => {
    try {
      const img = await ImagePicker.openPicker({
        width: 1050,
        height: 700,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        compressImageQuality: Platform?.OS === 'ios' ? 0.8 : 1,
      });

      const selectedImage: ImageType = {
        name: img.filename || 'profileImage',
        uri: img.path,
        path: img.path,
        type: img.mime,
      };
      return selectedImage;
      // setProfileImg(selectedImage);
    } catch (err) {
      console.log('Image Picker Cancelled');
    }
  };
  useEffect(() => {
    if (vehicleData) {
      console.log('vehicleData', vehicleData?.data);

      setForm(prev => ({
        ...prev,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || '',
        color: vehicleData.color || '',
        licensePlate: vehicleData.licensePlate || '',
        vinNumber: vehicleData.vinNumber || '',
        seatingCapacity: vehicleData.seatingCapacity || '',
        displayImage: vehicleData.displayImage || null,
        documents: vehicleData.documents?.length
          ? vehicleData.documents.map((doc: any) => ({
              documentNumber: doc.documentNumber || '',
              documentExpiryDate: doc.documentExpiryDate || '',
              file: doc.file || null,
            }))
          : [],
      }));
      setVehicle({
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || '',
        color: vehicleData.color || '',
        licensePlate: vehicleData.licensePlate || '',
        vinNumber: vehicleData.vinNumber || '',
        seatingCapacity: vehicleData.seatingCapacity || '',
        displayImage: vehicleData.displayImage || null,
        documents: vehicleData.documents?.length
          ? vehicleData.documents.map((doc: any) => ({
              documentNumber: doc.documentNumber || '',
              documentExpiryDate: doc.documentExpiryDate || '',
              file: doc.file || null,
            }))
          : [],
      });
    }
  }, [vehicleData]);

  return (
    <View>
      <Header showBack title={'My Vehicle'} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* SHOW VEHICLE */}
        {vehicle && !isEditing && (
          <View style={styles.card}>
            <CustomText style={styles.cardTitle}>
              {vehicle?.make} {vehicle?.model} ({vehicle?.year})
            </CustomText>

            <CustomText style={styles.cardText}>
              License: {vehicle?.licensePlate}
            </CustomText>
            <CustomText style={styles.cardText}>
              Color: {vehicle?.color}
            </CustomText>
            <CustomText style={styles.cardText}>
              VIN: {vehicle?.vinNumber}
            </CustomText>
            <CustomText style={styles.cardText}>
              Seating Capacity: {vehicle?.seatingCapacity}
            </CustomText>

            <View style={styles.divider} />

            <CustomText style={styles.section}>Document</CustomText>
            <CustomText style={styles.cardText}>
              Number: {vehicle?.documents[0]?.documentNumber}
            </CustomText>
            <CustomText style={styles.cardText}>
              Expiry: {vehicle?.documents[0]?.documentExpiryDate}
            </CustomText>

            <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
              <CustomText style={styles.btnText}>Edit Vehicle</CustomText>
            </TouchableOpacity>
          </View>
        )}

        {/* ADD / EDIT FORM */}
        {(isEditing || !vehicle) && (
          <View style={styles.formCard}>
            <CustomText style={styles.section}>Vehicle Image</CustomText>

            <TouchableOpacity
              style={styles.imageRow}
              onPress={async () => {
                let displayImage = await handleImagePicker();
                if (displayImage)
                  setForm(prev => ({
                    ...prev,
                    ['displayImage']: displayImage,
                  }));
              }}
            >
              <View>
                <CustomText style={styles.imageLabel}>Display Image</CustomText>
                <CustomText style={styles.imageSubText}>
                  Upload vehicle image
                </CustomText>
              </View>
              {form?.displayImage ? (
                <Image
                  source={{ uri: form?.displayImage.path }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.imageIcon}>
                  <SVG.CameraIcon />
                </View>
              )}
            </TouchableOpacity>
            {renderInput('Make', form?.make, v => onChange('make', v))}
            {renderInput('Model', form?.model, v => onChange('model', v))}
            {renderInput('Year', form?.year, v => onChange('year', v))}
            {renderInput('License Plate', form?.licensePlate, v =>
              onChange('licensePlate', v),
            )}
            {renderInput('Color', form?.color, v => onChange('color', v))}
            {renderInput('VIN Number', form?.vinNumber, v =>
              onChange('vinNumber', v),
            )}
            {renderInput('Seating Capacity', form?.seatingCapacity, v =>
              onChange('seatingCapacity', v),
            )}

            <View style={styles.divider} />

            <CustomText style={styles.section}>Document</CustomText>

            <TouchableOpacity
              style={styles.imageRow}
              onPress={async () => {
                let displayImage = await handleImagePicker();
                if (displayImage)
                  setForm(prev => ({
                    ...prev,
                    documents: [{ ...prev.documents[0], file: displayImage }],
                  }));
              }}
            >
              <View>
                <CustomText style={styles.imageLabel}>
                  Document Image
                </CustomText>
                <CustomText style={styles.imageSubText}>
                  Upload vehicle document image
                </CustomText>
              </View>
              {form?.documents[0]?.file ? (
                <Image
                  source={{ uri: form?.documents[0]?.file.path }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.imageIcon}>
                  <SVG.Uploadicon />
                </View>
              )}
            </TouchableOpacity>

            {renderInput(
              'Document Number',
              form?.documents[0]?.documentNumber,
              v =>
                setForm(prev => ({
                  ...prev,
                  documents: [{ ...prev.documents[0], documentNumber: v }],
                })),
            )}
            {renderInput(
              'Expiry Date',
              form?.documents[0]?.documentExpiryDate,
              v =>
                setForm(prev => ({
                  ...prev,
                  documents: [{ ...prev.documents[0], documentExpiryDate: v }],
                })),
            )}
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={date => {
                setForm(prev => ({
                  ...prev,
                  documents: [
                    {
                      ...prev.documents[0],
                      documentExpiryDate: date.toISOString(),
                    },
                  ],
                }));
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <CustomText style={styles.btnText}>
                {vehicle ? 'Update Vehicle' : 'Save Vehicle'}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F6F7FB',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  section: {
    fontSize: 16,
    fontFamily: Font.textSemiBolder,
    color: 'black',
    marginBottom: 8,
  },
  editBtn: {
    marginTop: 16,
    backgroundColor: Colors.default,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: 'black',
    fontFamily: Font.textSemiBolder,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,

    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#A0A0A0',
  },
  saveBtn: {
    marginTop: 16,
    backgroundColor: Colors.default,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontFamily: Font.textSemiBolder,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  imageLabel: {
    fontSize: 14,
    fontFamily: Font.textSemiBolder,
  },
  imageSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  imageIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#EEF2FF',
  },
});

export default AccountVehicleScreen;
