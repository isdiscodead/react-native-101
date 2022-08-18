import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';

import { theme } from "./colors";

import { AsyncStorage } from '@react-native-async-storage/async-storage';
const STORAGE_KEY = "@toDos"

export default function App() {

  // 어떤 메뉴를 선택했는지를 담는 state  
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true); 

  // 유저 입력 내용
  const [text, setText] = useState("");
  const onChangeText = ([payload]) => setText(payload);

  // todos -> HashMap 사용 ... 
  const [toDos, setToDos] = useState({});

  // Todo Data 저장 
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }

  // Todo Data 불러오기
  const loadToDos = async() => {
    const str = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos( JSON.parse(str) );
  }

  // 앱 실행 시 실행 
  useEffect(() => { loadToDos() }, []);

  // 투두 입력 버튼 핸들링 
  const addToDo = () => {
    if ( text == "" ) {
      return; 
    } 

    // toDos를 직접 수정 X 
    // 비어있는 object + target Object + 새로운 투두 
    // const newToDos = Object.assign( {}, toDos, {[Date.now()] : {text, work : working}} );
    const newToDos = {...toDos, [Date.now()]: { text, working:working } }

    // save todo 
    setToDos(newToDos);
    saveToDos(newToDos)

    setText(""); // 입력 창 비워주기
  }



  console.log(toDos);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>

        <TouchableOpacity>
          <Text style={{ ... styles.btnText, color: working ? "white" : theme.grey }} onPress={work}> Work </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }} onPress={travel}> Travel </Text>
        </TouchableOpacity>
      </View>

      <View>
          <TextInput
            style={styles.input}
            value={text}
            placeholder={ working? "Add a To Do" : "Where Do you Want to Go?" }
            onChangeText={onChangeText}
            onSubmitEditing={addToDo}
            returnKeyType={done}
          />
      </View>

      <ScrollView>
        { Object.keys(toDos).map((key) => 
          toDos[key].working === working ? ( <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}> toDos[key].text </Text>
            <Text>❌</Text>
          </View> 
          ) : null
        ) }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    // padding 0px 20px 대신 사용
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },

  btnText: {
    fontSize: 44,
    fontWeight: "600",
    color: theme.grey,
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },

  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
 
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
