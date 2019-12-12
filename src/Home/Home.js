import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  CoordinatorLayout,
  BottomSheetBehavior
} from 'react-native-bottom-sheet-behavior';
import ImagePicker from 'react-native-image-picker';
import { toast } from '../Public/components';
import Color from '../Public/Color';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'myfacilityapp'
  }
};
const marker = require('../Public/Assets/icon/marker.png');
class Home extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: 'Home'
  // });

  static navigationOptions = {
    header: null
  };

  state = {
    isMapReady: false,
    image: '',
    inputLocation: '',
    inputDetailLocation: '',
    inputProblem: '',
    status: 0,
    isLoading: false
  };

  onImageClick = async () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        toast('Cancel image pick');
      } else {
        this.setState({
          image: response.uri
        });
      }
    });
  };

  onChangeLayout = async () => {
    // this.setState({ status: 1 });
    // await this.setState({ isLoading: true });
    // await this.setState({ isLoading: false });

    await this.refs.map.animateToRegion(
      {
        latitude: -6.3302921,
        longitude: 106.6778804,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      },
      2000
    );
    await this.refs.bottomSheet.setBottomSheetState(
      BottomSheetBehavior.STATE_COLLAPSED
    );
  };

  render() {
    const { image } = this.state;
    return (
      <CoordinatorLayout style={styles.coodinatorlayout}>
        <MapView
          ref="map"
          showsUserLocation
          moveOnMarkerPress
          showsMyLocationButton
          showsScale={false}
          showsBuildings
          showsCompass
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.container}
          region={{
            latitude: -6.175392,
            longitude: 106.827153,
            latitudeDelta: 0.0555,
            longitudeDelta: 0.0521
          }}
          mapPadding={{
            top: 20,
            right: 0,
            bottom: 250,
            left: 0
          }}>
          {this.state.isMapReady ? (
            <Marker
              moveOnMarkerPress={true}
              style={{ height: 50, width: 50 }}
              coordinate={{
                latitude: -6.3302921,
                longitude: 106.6778804
              }}>
              <Image source={marker} style={{ height: 50, width: 45 }} />
            </Marker>
          ) : null}
        </MapView>
        <BottomSheetBehavior
          ref="bottomSheet"
          peekHeight={250}
          hideable={false}
          state={BottomSheetBehavior.STATE_COLLAPSED}>
          {this.state.status == 0 ? (
            <View style={{ height: height, backgroundColor: '#fff' }}>
              <FontAwesome5
                style={styles.icon}
                name="grip-lines"
                size={18}
                color="#c9c9c9"
              />
              <View style={styles.miniContainer}>
                <Text style={styles.textTitle}>Where are you ?</Text>
                <View
                  style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Input your location"
                    onFocus={() =>
                      this.refs.bottomSheet.setBottomSheetState(
                        BottomSheetBehavior.STATE_EXPANDED
                      )
                    }
                    onChangeText={text =>
                      this.setState({ inputLocation: text })
                    }
                    value={this.state.inputLocation}
                  />
                </View>
                <View
                  style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                  <FontAwesome5
                    style={styles.iconInput}
                    name="edit"
                    color="grey"
                    size={16}
                  />
                  <TextInput
                    style={styles.miniInput}
                    placeholder="Input detail location"
                    onFocus={() =>
                      this.refs.bottomSheet.setBottomSheetState(
                        BottomSheetBehavior.STATE_EXPANDED
                      )
                    }
                    onChangeText={text =>
                      this.setState({ inputDetailLocation: text })
                    }
                    value={this.state.inputDetailLocation}
                  />
                </View>
              </View>
              <View style={styles.miniContainer}>
                <Text style={styles.textTitle}>Whats your problem ?</Text>
                <View
                  style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Input your problem"
                    onFocus={() =>
                      this.refs.bottomSheet.setBottomSheetState(
                        BottomSheetBehavior.STATE_EXPANDED
                      )
                    }
                    onChangeText={text => this.setState({ inputProblem: text })}
                    value={this.state.inputProblem}
                  />
                </View>
              </View>
              <View style={styles.miniContainer}>
                <Text style={styles.textTitle}>Post a Picture!</Text>
                <TouchableOpacity
                  style={styles.image}
                  onPress={this.onImageClick}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                  ) : (
                    <View style={styles.image}>
                      <FontAwesome5 name="camera" color="grey" size={24} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.miniContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    await this.setState({ isMapReady: true, status: 1 });
                    await this.onChangeLayout();
                  }}
                  style={styles.button}>
                  {this.state.isLoading ? (
                    <ActivityIndicator
                      style={{ margin: 16 }}
                      size="small"
                      color="#FFF"
                    />
                  ) : (
                    <Text style={styles.textButton}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ height: height, backgroundColor: '#fff' }}>
              <FontAwesome5
                style={styles.icon}
                name="grip-lines"
                size={18}
                color="#c9c9c9"
              />
              <View style={styles.miniContainer}>
                <Text
                  style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
                  {this.state.inputLocation}
                </Text>
              </View>
              <View style={styles.miniContainer}>
                <View
                  style={[
                    styles.wrapperForm,
                    styles.wrapperDetailLocation,
                    { marginTop: -10 }
                  ]}>
                  <FontAwesome5
                    style={styles.iconInput}
                    name="edit"
                    color="grey"
                    size={16}
                  />
                  <TextInput
                    editable={false}
                    style={styles.miniInput}
                    placeholder="Input detail location"
                    onChangeText={text =>
                      this.setState({ inputDetailLocation: text })
                    }
                    value={this.state.inputDetailLocation}
                  />
                </View>
              </View>
              <View style={styles.miniContainer}>
                <View
                  style={{
                    height: 120,
                    width: '100%',
                    justifyContent: 'flex-end'
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      margin: 8,
                      alignItems: 'center'
                    }}>
                    <FontAwesome5
                      name="user-alt"
                      solid
                      color="black"
                      size={24}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'black',
                        marginLeft: 16
                      }}>
                      Your name goes here
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.miniContainer,
                  { borderTopWidth: 2, borderTopColor: '#c9c9c9' }
                ]}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: Color.tertiary,
                    margin: 16
                  }}>
                  Maintenance Progress
                </Text>
              </View>
            </View>
          )}
        </BottomSheetBehavior>
      </CoordinatorLayout>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  coodinatorlayout: {
    height,
    width: '100%'
  },
  container: {
    height,
    width: '100%'
  },
  headerBS: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    alignSelf: 'center',
    marginVertical: 5
  },
  miniContainer: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  textTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  wrapperForm: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5
  },
  input: {
    zIndex: 1,
    fontSize: 12,
    padding: 8
  },
  miniInput: {
    zIndex: 1,
    fontSize: 12,
    padding: 5,
    paddingLeft: 0
  },
  wrapperDetailLocation: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textDetails: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 8
  },
  iconInput: {
    margin: 8
  },
  image: {
    marginTop: 10,
    width: width / 2,
    height: width / 1.5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: Color.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  textButton: {
    margin: 16,
    color: 'white',
    fontWeight: 'bold'
  }
});
