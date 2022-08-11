import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from "expo-location";
import { Fontisto } from '@expo/vector-icons';

const { height, width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "dd9b85efe9e84d680d7bb103e58b6485"; 

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "cloudy-gusts",
  Snow : "snow",
  Rain : "rains",
  Drizzle : "rain",
  Thunderstorm : "lightning",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const ask = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if ( !granted ) {
      setOk(false); // 권한 설정 X
    }

    // 사용자 위치 가져오기 
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGooglemaps: false});
    setCity(location[0].city);

    // 날씨 data 가져오기
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    ask();
  }, [])

  return (
    <View style={styles.container}>

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >

        { days.length === 0 ? ( <View style={{ ...styles.day, alignItems:"center"}}>
            <ActivityIndicator color="white" size="large" style={styles.loading} /> 
          </View>
        ) : (
          days.map(( day, index) => 
            <View key={index} style={styles.day}>
              <View style={{ alignItems: "center" , justifyContent: "space-between"}}>
                <Text style={styles.temperature}> { parseFloat(day.temp.day).toFixed(1) } </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="black"></Fontisto>
              </View>
              <Text style={styles.description}> {day.weather[0].main} </Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )}

      </ScrollView>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({ // 자동 완성 가능한 style 객체 생성 ... container를 전달
  // css 틀리면 놀랍게도 native에서는 오류를 알려준다 ...
  container : {
    flex: 1,
    backgroundColor: '#99bab1',
  },
  cityName : {
    color: "#ed5f80",
    fontSize: 54,
    fontWeight: 'bold'
  },  
  city : {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weather : {
    // flex: 3, -> ScrollView는 항상 스크린보다 커야하므로 flex 속성 사용 X
    justifyContent: "center",
  },
  day : {
    // flex: 1,
    alignItems: "center",
    width: SCREEN_WIDTH,
  }, 
  temperature : {
    marginTop: 50,
    fontSize: 80,
  },
  description : {
    marginTop: -10,
    fontSize: 60,
  },
  loading : {
    marginTop : 10,
    textAlign : "center",
  },
  tinyText : {
    fontSize: 20,
  },
});
