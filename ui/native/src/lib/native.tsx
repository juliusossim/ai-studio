import { View, Text } from 'react-native';

/* eslint-disable-next-line */
export interface NativeProps {}

export function Native(props: NativeProps) {
  return (
    <View>
      <Text>Welcome to native!</Text>
    </View>
  );
}

export default Native;
