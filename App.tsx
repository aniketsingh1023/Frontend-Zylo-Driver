import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './src/Navigation/Navigation';
import configureAppStore from './src/Redux/Store';
import { navigationRef } from './src/screens/auth/navigationRef';

const App = () => {
  const { store, persistor } = configureAppStore();
  const [isDashboard, setIsDashboard] = React.useState(false);
  React.useEffect(() => {
    async function requestLocationPermission() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }
    requestLocationPermission();

    setTimeout(() => {
      setIsDashboard(true);
    }, 3000);
  }, []);
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <Navigation />
            <FlashMessage position="top" />
          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
