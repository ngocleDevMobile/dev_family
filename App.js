/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import Routes from './src/navigation/Routes';
import {AuthProvider} from './src/navigation/AuthProvider';

const App = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
};
export default App;
