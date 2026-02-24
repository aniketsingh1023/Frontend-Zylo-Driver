import {FlashMessageProps, showMessage} from 'react-native-flash-message';

export const successToast = (
  title: string,
  subTitle?: string,
  options: FlashMessageProps = {},
) => {
  showMessage({
    message: title,
    description: subTitle,
    duration: 1000,
    // hideStatusBar: true,
    icon: 'auto',
    titleProps: {
      allowFontScaling: false,
    },
    textProps: {allowFontScaling: false},
    type: 'success',
    titleStyle: {
      //   fontFamily: Fonts.primaryRegular,
      lineHeight: 14 * 1.4,
      fontSize: 16,
    },
    textStyle: {
      //   fontFamily: Fonts.primaryRegular,
    },
    ...options,
  });
};

export const errorToast = (
  title: string,
  subTitle?: string,
  options: FlashMessageProps = {},
) => {
  showMessage({
    message: title,
    description: subTitle,
    duration: 1000,
    type: 'danger',
    icon: 'auto',
    titleProps: {
      allowFontScaling: false,
    },
    textProps: {allowFontScaling: false},
    titleStyle: {
      //   fontFamily: Fonts.primaryRegular,
      lineHeight: 14 * 1.4,
      fontSize: 16,
    },
    textStyle: {
      //   fontFamily: Fonts.primaryRegular,
    },
    ...options,
  });
};

export const infoToast = (
  title: string,
  subTitle?: string,
  options: FlashMessageProps = {},
) => {
  showMessage({
    message: title,
    description: subTitle,
    duration: 1000,
    type: 'info',
    icon: 'auto',
    titleProps: {
      allowFontScaling: false,
    },
    textProps: {allowFontScaling: false},
    titleStyle: {
      //   fontFamily: Fonts.primaryRegular,
      lineHeight: 14 * 1.4,
      fontSize: 16,
    },
    textStyle: {
      //   fontFamily: Fonts.primaryRegular,
    },
    ...options,
  });
};

export const warnToast = (
  title: string,
  subTitle?: string,
  options: FlashMessageProps = {},
) => {
  showMessage({
    message: title,
    description: subTitle,
    duration: 1000,
    type: 'warning',
    icon: 'auto',
    titleProps: {
      allowFontScaling: false,
    },
    textProps: {allowFontScaling: false},
    titleStyle: {
      //   fontFamily: Fonts.primaryRegular,
      lineHeight: 14 * 1.4,
      fontSize: 16,
    },
    textStyle: {
      //   fontFamily: Fonts.primaryRegular,
    },
    ...options,
  });
};
