import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableNativeFeedback,
  View,
  Text
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { CoordinatorLayout } from 'react-native-bottom-sheet-behavior';
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
    isLoading: false
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
      })
      .catch(() => {
        // console.log(err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
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
    await this.refs.map.animateToRegion(
      {
        latitude: -6.3302921,
        longitude: 106.6778804,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      },
      2000
    );
  };

  render() {
    return (
      <View>
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
        </CoordinatorLayout>
        <View style={styles.buttonWrapper}>
          <TouchableNativeFeedback>
            <View style={[styles.buttonBottom]}>
              <Text xt style={styles.textButtonBottom}>
                TAKE ORDER
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
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
  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  buttonBottom: {
    width: '90%',
    margin: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#b5b5b5'
  },
  buttonActive: {
    backgroundColor: '#009c7c'
  },
  textButtonBottom: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
