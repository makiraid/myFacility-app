import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity
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

  componentDidMount() {
    setTimeout(() => {
      this.refs.map.animateToRegion(
        {
          latitude: -6.3302921,
          longitude: 106.6778804,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        },
        2000
      );
    }, 2000);
  }

  static navigationOptions = {
    header: null
  };

  state = {
    isMapReady: false,
    image: ''
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

  onMapLayout = () => {
    this.setState({ isMapReady: true });
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
          onLayout={this.onMapLayout}
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
          <View style={{ height: height, backgroundColor: '#fff' }}>
            <FontAwesome5
              style={styles.icon}
              name="grip-lines"
              size={18}
              color="#c9c9c9"
            />
            <View style={styles.miniContainer}>
              <Text style={styles.textTitle}>Where are you ?</Text>
              <View style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                <TextInput
                  style={styles.input}
                  placeholder="Input your location"
                  onFocus={() =>
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_EXPANDED
                    )
                  }
                />
              </View>
              <View style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
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
                />
              </View>
            </View>
            <View style={styles.miniContainer}>
              <Text style={styles.textTitle}>Whats your problem ?</Text>
              <View style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                <TextInput
                  style={styles.input}
                  placeholder="Input your problem"
                  onFocus={() =>
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_EXPANDED
                    )
                  }
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
              <View style={styles.button}>
                <Text style={styles.textButton}>Submit</Text>
              </View>
            </View>
          </View>
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
