import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors, Font } from './Theam';

interface InputProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  rightButtonPress?: () => void;
  borderStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  placeholder = '',
  value,
  onChangeText,
  leftButton,
  rightButton,
  rightButtonPress,
  borderStyle,
  containerStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: 12,
    zIndex: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8], // move label up
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: ['#A0A0A0', Colors.default || '#000'],
    }),
  };

  return (
    <View style={[styles.container, borderStyle, containerStyle]}>
      {leftButton && <View style={styles.leftBtn}>{leftButton}</View>}

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {!!placeholder && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.Text style={[styles.label, labelStyle]}>
              {placeholder}
            </Animated.Text>
          </View>
        )}

        <TextInput
          {...rest}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.textInput}
          placeholder=""
        />
      </View>

      {rightButton && (
        <TouchableOpacity style={styles.rightBtn} onPress={rightButtonPress}>
          {rightButton}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#A0A0A0',
    borderRadius: 8,
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    position: 'relative',
  },
  label: {
    fontFamily: Font.textNormal,
  },
  textInput: {
    height: 60,
    fontSize: 16,
    fontFamily: Font.textNormal,
    color: 'black',
    paddingHorizontal: 12,
  },
  leftBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default Input;
