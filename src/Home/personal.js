/* eslint-disable no-console */
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
  PermissionsAndroid,
  CheckBox,
  Alert
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';
import {
  CoordinatorLayout,
  BottomSheetBehavior
} from 'react-native-bottom-sheet-behavior';
// import SocketIOClient from 'socket.io-client';
import Axios from 'axios';
import ImagePicker from 'react-native-image-picker';

import { toast } from '../Public/components';
import Color from '../Public/Color';
// import { HOST_NAME } from 'react-native-dotenv';
const HOST_NAME = 'https://apidev-complainer.archv.id/';
import { connect } from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const options = {
  title: 'Select Photo',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'myfacilityapp'
  }
};
let data = false;
const marker = require('../Public/Assets/icon/marker.png');
const listMaintenance = [
  {
    id: 1,
    title: 'Staff Menuju Lokasi Anda'
  },
  {
    id: 2,
    title: 'Observasi'
  },
  {
    id: 3,
    title: 'Proses Perbaikan'
  },
  {
    id: 4,
    title: 'Selesai'
  }
];
class personal extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      isMapReady: false,
      image: '',
      imagedata: {
        uri: '',
        type: '',
        name: ''
      },
      inputLocation: '',
      inputDetailLocation: '',
      inputProblem: '',
      status: 0,
      region: {
        latitude: -6.175392,
        longitude: 106.827153,
        latitudeDelta: 0.0555,
        longitudeDelta: 0.0521
      },
      markerRegion: {
        latitude: '',
        longitude: ''
      },
      locationName: 'Input your location',
      isLoading: false,
      changeLocation: false,
      idSocketStatus: 0,
      hideLogout: false
    };
  }

  componentDidMount = async () => {
    await Geolocation.getCurrentPosition(
      async info => {
        await this.setState({
          markerRegion: {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          },
          isMapReady: true
        });
      },
      error => {
        toast('Error while getting your location');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
    await this.onChangeLayout();
  };

  withchangeLocation = () => {
    this.setState({
      region: {
        latitude: this.state.markerRegion.latitude,
        longitude: this.state.markerRegion.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        changeLocation: !this.state.changeLocation
      }
    });
    data = !data;
  };

  handleChangeRegion = info => {
    this.setState({
      region: info,
      markerRegion: {
        latitude: info.latitude,
        longitude: info.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      isLoading: true
    });
    const body = {
      // eslint-disable-next-line prettier/prettier
      latlong: `${this.state.markerRegion.latitude}, ${this.state.markerRegion.longitude}`
    };
    Axios.post(`${HOST_NAME}api/v1/geocoding`, body)
      .then(res => {
        this.setState({
          inputLocation: res.data.locationName
        });
      })
      .catch(() => {
        // console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  requestPermissionLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permisson granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  onImageClick = async () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        toast('Cancel image pick');
      } else {
        this.setState({
          image: response.uri,
          imagedata: {
            uri: response.uri,
            type: response.type,
            name: response.fileName
          }
        });
      }
    });
  };

  onChangeLayout = async () => {
    let { markerRegion, isMapReady } = this.state;
    if (isMapReady === true) {
      setTimeout(() => this.refs.map.animateToRegion(markerRegion, 2000), 200);
    }
  };

  handleSubmitOrder = () => {
    const { userCode, token } = this.props.auth;
    this.setState({
      isLoading: true
    });
    // eslint-disable-next-line no-shadow
    let data = new FormData();
    // eslint-disable-next-line no-sequences
    data.append('userCode', userCode),
      data.append('token', token),
      data.append(
        'locationCoor',
        // eslint-disable-next-line prettier/prettier
        `${this.state.markerRegion.latitude}, ${this.state.markerRegion.longitude}`
      ),
      data.append('locationName', this.state.inputLocation),
      data.append('locationDetail', this.state.inputDetailLocation),
      data.append('problemDetail', this.state.inputProblem),
      data.append('problemPic', this.state.imagedata);

    Axios.post(`${HOST_NAME}api/v1/order-submit`, data)
      .then(res => {
        this.setState({
          status: 1
        });
        console.log(res.data);
        toast('Sukses membuat pesanan' + res.data.orderId);
        this.setSocketOn(res.data.orderId);
      })
      .catch(() => {
        toast('Gagal membuat pesanan');
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  setSocketOn = orderId => {
    // const SOCKET_HOSTS = 'http://35.240.193.202:3001/';
    // console.log(orderId);
    // var socket = SocketIOClient(`${SOCKET_HOSTS}socket/v1/order-update`);
    // socket.on(orderId, res => {
    //   console.log(res);
    // });

    setInterval(async () => {
      await Axios.post(`${HOST_NAME}api/v1/cek-status`, {
        orderId
      })
        .then(res => {
          this.setState({
            idSocketStatus: res.data.orderStatus
          });
        })
        .catch(() => {
          toast('Error while getting status');
        });
    }, 36000);
  };

  componentWillUnmount() {
    clearInterval();
  }

  handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are u sure ?',
      [
        {
          text: 'Cancel',
          onPress: () => toast('Cancel log out'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            await this.props.logout();
            // await navigation.navigate('Auth');
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { image, markerRegion, region, status } = this.state;
    return (
      <React.Fragment>
        <CoordinatorLayout style={styles.coodinatorlayout}>
          <MapView
            ref="map"
            showsUserLocation
            moveOnMarkerPress
            showsMyLocationButton
            onMapReady={this.onChangeLayout}
            showsScale={false}
            showsBuildings
            showsCompass
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.container}
            onRegionChangeComplete={
              status === 0 && data === true ? this.handleChangeRegion : null
            }
            region={region}
            mapPadding={{
              top: 20,
              right: 0,
              bottom: 250,
              left: 0
            }}>
            {this.state.isMapReady && data === false ? (
              <Marker
                moveOnMarkerPress={true}
                style={{ height: 50, width: 50 }}
                coordinate={{
                  latitude: markerRegion.latitude,
                  longitude: markerRegion.longitude
                }}>
                <Image source={marker} style={{ height: 50, width: 45 }} />
              </Marker>
            ) : (
              <Marker
                moveOnMarkerPress={true}
                style={{ height: 50, width: 50 }}
                coordinate={{
                  latitude: markerRegion.latitude,
                  longitude: markerRegion.longitude
                }}
              />
            )}
          </MapView>
          {data === true ? null : (
            <View
              style={{
                position: 'absolute',
                marginTop: 20,
                height: height / 4,
                width: '185%',
                borderRadius: 5,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <TouchableOpacity
                onPress={() => this.handleLogout(this.props.navigation)}
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  elevation: 4
                }}>
                <FontAwesome5
                  name="sign-out-alt"
                  size={25}
                  color={Color.quarternary}
                />
              </TouchableOpacity>
            </View>
          )}
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
              {this.state.status === 0 ? (
                <View
                  style={{
                    height: height,
                    backgroundColor: '#fff'
                  }}>
                  <FontAwesome5
                    style={styles.icon}
                    name="grip-lines"
                    size={18}
                    color="#c9c9c9"
                  />
                  <View style={styles.miniContainer}>
                    <Text style={styles.textTitle}>Where are you ?</Text>
                    <View
                      style={[
                        styles.wrapperForm,
                        styles.wrapperDetailLocation,
                        { justifyContent: 'space-between' }
                      ]}>
                      <TextInput
                        style={styles.input}
                        editable={false}
                        multiline={true}
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
                      <TouchableOpacity
                        onPress={this.withchangeLocation}
                        style={styles.changeLocation}>
                        <FontAwesome5
                          name={data === true ? 'check' : 'map'}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        styles.wrapperForm,
                        styles.wrapperDetailLocation
                      ]}>
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
                      style={[
                        styles.wrapperForm,
                        styles.wrapperDetailLocation
                      ]}>
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
                      onPress={this.handleSubmitOrder}
                      style={styles.button}>
                      <Text style={styles.textButton}>Submit</Text>
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
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: 'black'
                      }}>
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
                          {this.props.auth.name}
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
                    <View style={styles.parentCheckbox}>
                      {listMaintenance.map((item, index) => {
                        let isActive = false;
                        if (index + 1 <= this.state.idSocketStatus) {
                          isActive = true;
                        }
                        return (
                          <View key={index} style={styles.checkboxWrapper}>
                            <CheckBox disabled={true} value={isActive} />
                            <Text>{item.title}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
            </BottomSheetBehavior>
          )}
        </CoordinatorLayout>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth.authToken
});

const mapDispatchToProps = dispatch => ({
  logout: payload =>
    dispatch({
      type: 'LOGOUT_FULFILLED',
      payload
    })
});

// eslint-disable-next-line prettier/prettier
export default connect(mapStateToProps, mapDispatchToProps)(personal);

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
    padding: 8,
    width: '70%'
  },
  miniInput: {
    zIndex: 1,
    fontSize: 12,
    padding: 5,
    paddingLeft: 0,
    width: '70%'
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
  changeLocation: {
    height: 40,
    width: 40,
    backgroundColor: Color.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  parentCheckbox: {
    width: '100%',
    backgroundColor: 'white'
    // padding: 15
  },
  checkboxWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});
