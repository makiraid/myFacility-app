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
  CheckBox,
  Alert
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
import SocketIOClient from 'socket.io-client';
import { HOST_NAME, SOCKET_HOST } from 'react-native-dotenv';
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
const listMaintenance = [
  {
    id: 1,
    title: 'Im On the way'
  },
  {
    id: 2,
    title: 'Observasi'
  },
  {
    id: 3,
    title: 'Proses Perbaikan'
  }
];
class personal extends Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.pointer();
  }

  state = {
    isShow: true,
    isMapReady: NaN,
    image: '',
    inputLocation: '',
    inputDetailLocation: '',
    inputProblem: '',
    orderId: '',
    isLoading: false,
    isButton: true,
    isCheckbox: false,
    markerActive: {},
    dataActive: null,
    statusType: 1,
    singleMarker: ''
  };

  pointer = () => {
    if (!this.props.pickedOrder.data) {
      this.getOrder();
    } else {
      this.setOldOrder();
    }
  };

  setOldOrder = () => {
    const { userCode, token } = this.props.auth;
    const { orderId } = this.props.pickedOrder.data;
    this.setState({
      isLoading: true
    });
    const body = {
      userCode,
      token,
      orderId
    };
    Axios.post(`${HOST_NAME}api/v1/order-detail`, body)
      .then(res => {
        const { locationcoor, orderstatus } = res.data.orderDetail[0];
        const latlong = locationcoor.split(',');
        let lat = Number(latlong[0]);
        let long = Number(latlong[1]);
        const singleMarker = {
          lat,
          long
        };
        this.setState({
          isCheckbox: true,
          isButton: false,
          statusType: orderstatus,
          singleMarker,
          orderId
        });
        this.onChangeLayout(lat, long, 0.002, 0.002);
      })
      .catch(err => {
        toast('Error get order detail' + JSON.stringify(err.message));
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  getOrder = () => {
    const { userCode, token } = this.props.auth;
    this.setState({
      isLoading: true,
      statusType: 1
    });
    const body = {
      userCode: userCode,
      token: token
    };
    Axios.post(`${HOST_NAME}api/v1/order-list`, body)
      .then(res => {
        this.props.setOrderData(res.data.orders);
        this.animate(res.data.orders);
      })
      .catch(err => {
        toast('Error get order' + JSON.stringify(err.message));
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  takeOrder = () => {
    const { userCode, token } = this.props.auth;
    const { orderId } = this.state;
    this.setState({
      isLoading: true
    });
    const body = {
      userCode: userCode,
      token: token,
      orderId
    };
    Axios.post(`${HOST_NAME}api/v1/order-take`, body)
      .then(async res => {
        if (res.data.resultCode === 0) {
          this.setState({
            isCheckbox: true,
            isButton: false
          });
          toast('Sukses mengambil order');
          const bodyPickedOrder = {
            orderId: orderId
          };
          this.props.setPickedOrder(bodyPickedOrder);
        } else {
          toast(res.data.resultDesc);
        }
        // await this.props.pickedOrder(res.data.orders);
        // this.animate(res.data.orders);
      })
      .catch(() => {
        toast('Error take order');
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  updateStatus = async statusType => {
    const { userCode, token } = this.props.auth;
    const { orderId } = this.state;
    const socket = SocketIOClient(SOCKET_HOST);
    socket.emit('update', {
      userCode: userCode,
      token: token,
      orderId: orderId,
      orderStatus: statusType
    });
  };

  resetData = () => {
    this.updateStatus(4);
    this.setState({
      orderId: '',
      isButton: true,
      isCheckbox: false,
      isLoading: false
    });
    this.getOrder();
    this.props.setClearPickedOrder();
  };

  returnModal = () => {
    Alert.alert(
      '',
      'Apakah anda yakin untuk menyelesaikan pesanan?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'YA',
          onPress: () => this.resetData()
        }
      ],
      { cancelable: true }
    );
  };

  animate = order => {
    let latMin = 0,
      latMax = 0,
      longMin = 0,
      longMax = 0,
      latSum = 0,
      longSum = 0;

    order.forEach(item => {
      const split = item.locationcoor.split(',');
      let lat = split[0];
      let long = split[1];

      lat = Number(lat);
      long = Number(long);

      if (latMax === 0 && latMin === 0 && longMin === 0 && longMin === 0) {
        latMax = lat;
        latMin = lat;
        longMax = long;
        longMin = long;
      }
      if (lat < latMin) {
        latMin = lat;
      } else {
        if (lat > latMax) {
          latMax = lat;
        }
      }
      if (long < longMin) {
        longMin = long;
      } else {
        if (long > longMax) {
          longMax = long;
        }
      }
      latSum += lat;
      longSum += long;
    });

    let latDelta = latMax - latMin + 0.02;
    let longDelta = longMax - longMin + 0.02;
    let latAvg = latSum / order.length;
    let longAvg = longSum / order.length;

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

  confirmOrder = async () => {
    this.openModal();
  };

  setItem = item => {
    this.setState({
      isButton: true,
      isCheckbox: false,
      isLoading: false,
      inputLocation: item.locationname,
      inputDetailLocation: item.locationdetail,
      inputProblem: item.problemdetail,
      orderId: item.orderid,
      image: item.problempic
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
            await this.props.navigation.navigate('Auth');
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { image } = this.state;
    return (
      <React.Fragment>
        {this.state.isShow ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 2,
              top: 80,
              right: 13,
              alignItems: 'center'
            }}>
            <TouchableOpacity
              onPress={() => this.handleLogout(this.props.navigation)}
              style={{
                zIndex: 0,
                height: 37.5,
                width: 37.5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 5,
                elevation: 5
              }}>
              <FontAwesome5
                name="sign-out-alt"
                size={20}
                color={Color.quarternary}
              />
            </TouchableOpacity>
          </View>
        ) : null}
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
            initialRegion={{
              latitude: -6.175392,
              longitude: 106.827153,
              latitudeDelta: 0.0555,
              longitudeDelta: 0.0521
            }}
            mapPadding={{
              top: 20,
              right: 0,
              bottom: 80,
              left: 0
            }}>
            {!this.state.isMapReady ? null : !this.props.order ? (
              <Text>{this.props.auth.name}</Text>
            ) : (
              this.props.order.map(item => {
                const split = item.locationcoor.split(',');
                const lat = Number(split[0]);
                const long = Number(split[1]);
                const markerDisable = require('../Public/Assets/icon/marker-disable.png');
                return (
                  <Marker
                    moveOnMarkerPress={true}
                    style={{ height: 50, width: 50 }}
                    onPress={() => {
                      this.setItem(item);
                      this.onChangeLayout(lat, long, 0.002, 0.001);
                    }}
                    coordinate={{
                      latitude: lat,
                      longitude: long
                    }}>
                    <Image
                      source={
                        this.state.orderId === item.orderid
                          ? marker
                          : markerDisable
                      }
                      style={{ height: 50, width: 45 }}
                    />
                  </Marker>
                );
              })
            )}
            {this.state.singleMarker ? (
              <Marker
                moveOnMarkerPress={true}
                style={{ height: 50, width: 50 }}
                coordinate={{
                  latitude: this.state.singleMarker.lat,
                  longitude: this.state.singleMarker.long
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
              onStateChange={e => {
                if (e.nativeEvent.state == 4) {
                  this.setState({ isShow: true });
                } else {
                  this.setState({ isShow: false });
                }
              }}
              state={BottomSheetBehavior.STATE_COLLAPSED}>
              {this.state.isButton ? (
                <View
                  style={{ height: 66, backgroundColor: 'rgba(0,0,0,0.0)' }}>
                  <View style={styles.miniContainer}>
                    <TouchableNativeFeedback
                      onPress={() => {
                        this.setState({
                          isButton: false,
                          isCheckbox: false,
                          isLoading: false
                        });
                      }}
                      disabled={!this.state.orderId}>
                      <View
                        style={[
                          styles.buttonBottom,
                          this.state.orderId ? styles.activeButton : null
                        ]}>
                        <Text style={styles.textButtonBottom}>
                          LIHAT DETAIL
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                </View>
              ) : this.state.isCheckbox ? (
                <View style={styles.parentCheckbox}>
                  <Text style={styles.textTitle}>Let's Check Your</Text>
                  {listMaintenance.map((item, index) => {
                    let isActive = false;
                    if (index + 1 <= this.state.statusType) {
                      isActive = true;
                    }
                    return (
                      <View key={index} style={styles.checkboxWrapper}>
                        <CheckBox
                          onValueChange={() => {
                            this.setState({ statusType: index + 1 });
                            this.updateStatus(index + 1);
                          }}
                          disabled={isActive}
                          value={isActive}
                        />
                        <Text>{item.title}</Text>
                      </View>
                    );
                  })}
                  <TouchableNativeFeedback onPress={() => this.returnModal()}>
                    <View style={styles.button}>
                      <Text style={styles.textButton}>SELESAIKAN PESANAN</Text>
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
                      style={[
                        styles.wrapperForm,
                        styles.wrapperDetailLocation
                      ]}>
                      <TextInput
                        style={styles.input}
                        editable={false}
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
                        editable={false}
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
                        editable={false}
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
                    <TouchableOpacity style={styles.image}>
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
                      onPress={this.takeOrder}
                      style={styles.button}>
                      <Text style={styles.textButton}>AMBIL PESANAN</Text>
                    </TouchableOpacity>
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
  auth: state.auth.authToken,
  order: state.order.data,
  pickedOrder: state.pickedOrder
});

const mapDispatchToProps = dispatch => ({
  setOrderData: payload =>
    dispatch({
      payload,
      type: 'GET_ORDER_FULFILLED'
    }),
  logout: payload =>
    dispatch({
      type: 'LOGOUT_FULFILLED',
      payload
    }),
  setPickedOrder: payload =>
    dispatch({
      type: 'PICKED_ORDER_FULFILLED',
      payload
    }),
  setClearPickedOrder: payload =>
    dispatch({
      type: 'PICKED_ORDER_FULFILLED',
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
    zIndex: 10,
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
  },
  modalContainer: {
    paddingTop: 250,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 200,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  }
});
