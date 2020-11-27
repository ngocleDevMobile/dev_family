import React, {useCallback} from 'react';
import {View, Text, StatusBar} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

export default function useStatusBar(style, animated = true) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, animated);
    }, []),
  );
}
