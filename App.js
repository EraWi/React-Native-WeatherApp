import React from 'react';
import { StyleSheet, Text, View, Button, ToastAndroid, Image } from 'react-native';
import axios from 'axios';

export default class App extends React.Component {

  constructor(){
    super();
    this.state = {
      isRendered: false,
      currentWeather: []
    }
    this.onButtonpress = this.onButtonpress.bind(this);
  }

  getWeather(){
    const url = 'http://api.openweathermap.org/data/2.5/find?q=Oulu,FI&units=metric&appid=yourApiKey';
    axios.get(url).then((response) =>{
      if(response.status == 200){
        console.log(response.data);
        var weatherTemp = response.data.list;
        var tempList = [];
        weatherTemp.forEach((element, index) =>{
          tempList = tempList.concat([
            {
              city: element.name,
              weatherType: element.weather['0'].main,
              weatherCode: element.weather['0'].id,
              temperature: element.main.temp
            }
          ]);
        });
        this.setState({currentWeather: tempList});
      }
    }).catch((error) =>{
      console.log(error);
    });
  }

  // Refresh the data with button press
  onButtonpress(){
    this.setState({isRendered: false});
    this.getWeather();
    ToastAndroid.showWithGravity(
      'Refreshed data!',
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  }

  weatherTypeCheck(weatherCode){
    // Thunder
    if(weatherCode >= 200 && weatherCode <= 232){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/otGaEtm.png'}} />
    }
    // Drizzle
    if(weatherCode >= 300 && weatherCode <= 321){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/cYmKmuJ.png'}} />
    }
    // Rain
    if(weatherCode >= 500 && weatherCode <= 531){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/hy9vX0c.png'}} />
    }
    // Snow
    if(weatherCode >= 600 && weatherCode <= 622){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/ka5aqcw.png'}} />
    }
    // Clear
    if(weatherCode = 800){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/yoM2nCd.png'}} />
    }
    // Cloudy
    if(weatherCode >= 801 && weatherCode <= 804){
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/AUQ9EIz.png'}} />
    }
    // N/A
    else{
      return <Image style={{width: 50, height: 50}} source={{uri: 'https://i.imgur.com/Mry9YBz.png'}} />
    }
  }

  // Check state before rendering to avoid looping
  componentWillMount(){
    if(!this.state.isRendered){
      this.getWeather();
      this.setState({isRendered: true});
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Current weather
          </Text>
        </View>
        {
          this.state.currentWeather.map((element, index) =>{
            return(
              <View key={index} style={styles.dataContainer}>
                <View style={styles.innerDataContainerTop}>
                  <Text style={styles.city}>
                    {element.city}
                  </Text>
                  {this.weatherTypeCheck(element.weatherCode)}
                </View>
                <View style={styles.innerDataContainerBottom}>
                  <Text style={styles.temperature}>
                    {element.temperature}°C
                  </Text>
                  <Text style={styles.conditions}>
                    {element.weatherType}
                  </Text>
                </View>
              </View>
            )
          })
        }
        <View style={{position: 'absolute', bottom: 10}}>
          <Button
            onPress={this.onButtonpress}
            title='Refresh'
          />
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#82ccdd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContainer: {
    backgroundColor: 'white',
    marginTop: 50,
    marginBottom: 100,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderRadius: 10,
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDataContainerTop: {
    paddingLeft: 50,
    paddingRight: 50,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'grey'
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 45,
    color: '#262626',
    fontWeight: 'bold'
  },
  city: {
    fontSize: 60,
    color: '#333333',
    fontWeight: 'bold'
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333333'
  },
  conditions: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333333'
  }
});
