import { ImageType } from './authTypes';
import { UserType } from './userTypes';
export interface IDocumentsList {
  file: ImageType | any;
  documentExpiryDate: any;
  documentNumber: any;
}
export interface IRiderSignUpFormPayload extends UserType {
  profilePicture: any;
  documents?: IDocumentsList[];
}

interface IVehicleDocument {
  documentExpiryDate: string;
  documentNumber: string;
  file: null | ImageType;
}
export interface IVehicleFormPayload {
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vinNumber: string;
  seatingCapacity: string;
  documents: IVehicleDocument[];
  displayImage: null | ImageType;
}
