import {IAddress} from './userTypes';

export type BasketItem = {
  basketItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
};

export type BasketData = {
  id: string;
  basketItems: BasketItem[];
  buyerId: string;
  buyerName: string;
};

export type BasketApiResponse = {
  success: boolean;
  message: string;
  data: BasketData;
};

export type AddToBasketPayload = {
  productId: string;
  quantity: number;
};

export type PlaceOrderPayload = {
  shippingAddress: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    addressLink: string;
  };
};

export type UserBasketResponse = {
  success: boolean;
  message: string;
  data: BasketData;
};

export interface IShippingItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
export interface OrderListResponseData {
  message: string;
  success: string;
  data: IOrder[];
}

export interface IOrder {
  id: string;
  orderedById: string;
  orderedBy: string;
  orderPlacedDateAndTime: string; // ISO date string
  shippingAddress: IAddress;
  shippingItems: IShippingItem[];
  subTotal: number;
  flatTax: number | null;
  percentageTax: number | null;
  total: number;
  orderStatus: IOrderStatus; // extend as needed
  paymentStatus: 'NotPaid' | 'Paid' | string;
  paymentType: string | null;
  deliveredTime: string | null;
  orderRead: boolean;
  specialInstruction?: string;
}
export type IOrderStatus =
  | 'Pending'
  | 'Accepted'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Declined'
  | 'Cancelled';

export interface IFeedback {
  reviewType: string;
  label: string;
  Description: string;
  Stars: number;
}
