import {NavigationContainer} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList,Text,TouchableOpacity, Dimensions} from 'react-native';
import {Title} from 'react-native-paper';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatusBar from '../utils/useStatusBar';

const {width, height} = Dimensions.get('screen');

export default function HomeScreen({navigation}) {
  useStatusBar('light-content');
  const {user, logout} = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const unsubscribe = firestore()
      .collection('THREADS')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          //console.log("Data----"+JSON.stringify(documentSnapshot));
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data()
          };
        });

         setThreads(threads);
        //console.log("Data----"+JSON.stringify(threads));

        if (loading) {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const renderItem = ({item}) => (
    <TouchableOpacity  onPress={() => navigation.navigate('Room', { thread: item })}>
    <View>
        <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text numberOfLines={1}>{item.latestMessage.text}</Text>
        </View>
    </View>
</TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={renderItem}
        // renderItem={({ item }) => (
        //   <TouchableOpacity
        //     style={{flex: 1, backgroundColor: 'orange'}}
        //     onPress={() => navigation.navigate('Room', { thread: item })}
        //   >
        //     <List.Item
        //       title={item.name}
        //       description={item.latestMessage.text}
        //       titleNumberOfLines={1}
        //       titleStyle={styles.listTitle}
        //       descriptionStyle={styles.listDescription}
        //       descriptionNumberOfLines={1}
        //     />
        //    <View>
        //      <Text style={styles.listTitle}>{item.name}</Text>
        //    </View>
        //   </TouchableOpacity>
        // )}
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
  

bgAvatar: {
  flex: 2
},
avatar:{
  width: width*15/100,
  height: width*15/100,
  borderRadius: width*10/100,
},
info: {
  flex: 8,
  flexDirection: 'column',
  paddingLeft: 0,
  justifyContent: 'center'

},
name: {
  fontWeight: 'bold',
  color: 'black',
  fontSize: 16,
  paddingBottom: 3
},
bgSeen: {
  flex: 2,
  alignItems: 'center',
  justifyContent: 'center'
},
avatarSeen: {
  width: width*5/100,
  height: width*5/100,
  borderRadius: width*2.5/100,
},
});
