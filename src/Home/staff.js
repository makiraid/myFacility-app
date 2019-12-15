import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TouchableNativeFeedback,
  CheckBox
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
import Axios from 'axios';
import { HOST_NAME } from 'react-native-dotenv';
import { connect } from 'react-redux';

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
class personal extends Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.getOrder();
  }

  state = {
    isMapReady: false,
    image: '',
    inputLocation: '',
    inputDetailLocation: '',
    inputProblem: '',
    status: 0,
    isLoading: false,
    isButton: true,
    isCheckbox: false,
    orderList: [
      {
        name: 'Diana',
        latitude: -6.225853,
        longitude: 106.851921
      },
      {
        name: 'Diana',
        latitude: -6.226539,
        longitude: 106.854402
      }
    ]
  };

  getOrder = () => {
    const { userCode, token } = this.props.auth;
    this.setState({
      isLoading: true
    });
    const body = {
      userCode: userCode,
      token: token
    };
    Axios.post(`${HOST_NAME}api/v1/order-list`, body)
      .then(res => {
        // console.log(res);
        this.animate();
      })
      .catch(() => {
        // console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  animate = () => {
    let latMin = 0,
      latMax = 0,
      longMin = 0,
      longMax = 0,
      latSum = 0,
      longSum = 0;

    this.state.orderList.forEach(item => {
      if (latMax === 0 && latMin === 0 && longMin === 0 && longMin === 0) {
        latMax = item.latitude;
        latMin = item.latitude;
        longMax = item.longitude;
        longMin = item.longitude;
      }
      if (item.latitude < latMin) {
        latMin = item.latitude;
      } else {
        if (item.latitude > latMax) {
          latMax = item.latitude;
        }
      }
      if (item.longitude < longMin) {
        longMin = item.longitude;
      } else {
        if (item.longitude > longMax) {
          longMax = item.longitude;
        }
      }
      latSum += item.latitude;
      longSum += item.longitude;
    });

    let latDelta = latMax - latMin + 0.02;
    let longDelta = longMax - longMin + 0.02;
    let latAvg = latSum / this.state.orderList.length;
    let longAvg = longSum / this.state.orderList.length;

    setTimeout(() => {
      this.onChangeLayout(latAvg, longAvg, latDelta, longDelta);
    }, 500);
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

  onChangeLayout = async (lang, long, langDelta, longDelta) => {
    await this.refs.map.animateToRegion(
      {
        latitude: lang,
        longitude: long,
        latitudeDelta: langDelta,
        longitudeDelta: longDelta
      },
      1500
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
        {this.state.isLoading ? (
          <View style={styles.overlayLoading}>
            <BottomSheetBehavior
              ref="bottomSheet"
              peekHeight={100}
              hideable={false}
              state={BottomSheetBehavior.STATE_HIDDEN}>
              <View style={styles.parent}>
                <ActivityIndicator size="large" color={Color.primary} />
              </View>
            </BottomSheetBehavior>
          </View>
        ) : (
          <BottomSheetBehavior
            ref="bottomSheet"
            peekHeight={250}
            hideable={false}
            state={BottomSheetBehavior.STATE_COLLAPSED}>
            {this.state.isButton ? (
              <View style={{ height: 66, backgroundColor: 'rgba(0,0,0,0.0)' }}>
                <View style={styles.miniContainer}>
                  <TouchableNativeFeedback
                    onPress={() => {
                      this.setState({
                        isButton: false,
                        isCheckbox: false,
                        isLoading: false
                      });
                    }}>
                    <View style={[styles.buttonBottom, styles.activeButton]}>
                      <Text style={styles.textButtonBottom}>TAKE ORDER</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
            ) : this.state.isCheckbox ? (
              <View style={styles.parentCheckbox}>
                <Text style={styles.textTitle}>Let's Check Your</Text>
                <TouchableOpacity style={styles.checkboxWrapper}>
                  <CheckBox />
                  <Text>I'm OTW</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkboxWrapper}>
                  <CheckBox />
                  <Text>Observasi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkboxWrapper}>
                  <CheckBox />
                  <Text>Proses Perbaikan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkboxWrapper}>
                  <CheckBox />
                  <Text>Selesai</Text>
                </TouchableOpacity>
                <TouchableNativeFeedback>
                  <View style={styles.button}>
                    <Text style={styles.textButton}>Done</Text>
                  </View>
                </TouchableNativeFeedback>
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
                      onChangeText={text =>
                        this.setState({ inputProblem: text })
                      }
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
                      await this.setState({
                        isCheckbox: true,
                        isLoading: false,
                        isButton: false
                      });
                    }}
                    style={styles.button}>
                    <Text style={styles.textButton}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </BottomSheetBehavior>
        )}
      </CoordinatorLayout>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth.authToken
});

export default connect(mapStateToProps)(personal);

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
  },
  parent: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  overlayLoading: {
    zIndex: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  },
  overlayButton: {
    zIndex: 0,
    backgroundColor: 'rgba(0,0,0,0.0)',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  },
  overlayCheckbox: {
    zIndex: 0,
    backgroundColor: 'rgba(0,0,0,0.0)',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  },
  parentButton: {
    width: '100%',
    padding: 15
  },
  parentCheckbox: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15
  },
  buttonBottom: {
    backgroundColor: '#b5b5b5',
    padding: 15,
    borderRadius: 5
  },
  activeButton: {
    backgroundColor: Color.primary
  },
  textButtonBottom: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  checkboxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
