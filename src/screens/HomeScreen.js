import {NavigationContainer} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Title} from 'react-native-paper';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useStatusBar from '../utils/useStatusBar';

export default function HomeScreen({navigation}) {
  useStatusBar('light-content');
  const {user, logout} = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubcribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const thread = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(thread);
        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubcribe();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      <Title style={{color: '#000'}}>Home Screen</Title>
      <Title style={{color: '#000'}}>All chat rooms will be listed here</Title>
      {/* <Title>{user.uid}</Title> */}
      <FormButton
        modeValue="contained"
        title="Logout"
        onPress={() => logout()}
      />
      <FormButton
        modeValue="contained"
        title="Add Room"
        onPress={() => navigation.navigate('AddRoom')}
      />
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Room', {thread: item})}>
            <List.Item
              title={item.name}
              description={item.latestMessage.text}
              titleNumberOfLines={1}
              titleStyle={styles.listtitle}
              descriptionStyle={styles.litsDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listtitle: {
    fontSize: 22,
  },
  litsDescription: {
    fontSize: 16,
  },
});
