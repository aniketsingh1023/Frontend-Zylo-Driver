import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {IAddress} from '../api/types/userTypes'; // adjust the import path
import CustomText from './CustomText';
import AddressModal from './AddressModal';

interface AddressCardProps {
  address: IAddress;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, {borderColor: isSelected ? '#4CAF50' : '#ddd'}]}
      onPress={onSelect}>
      <View style={styles.header}>
        <CustomText style={styles.name}>{address.addressTitle}</CustomText>
        {isSelected && <Text style={styles.selected}>Selected</Text>}
      </View>

      <CustomText style={styles.detail}>
        Street address : {address.streetAddress}
      </CustomText>
      {address.country && (
        <CustomText style={styles.detail}>{address.country}</CustomText>
      )}
      <CustomText style={styles.detail}>
        {address.city}, {address.state} - {address.zipcode}
      </CustomText>
      {/* <CustomText style={styles.detail}>Mobile: {'9131696076'}</CustomText> */}

      <View style={styles.actions}>
        {/* {onEdit && (
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        )} */}
        {onDelete && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={onDelete}>
            <Text style={[styles.actionText, {color: '#e53935'}]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  selected: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    marginLeft: 12,
  },
  deleteBtn: {
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#007BFF',
    textTransform: 'capitalize',
  },
});

export default AddressCard;
