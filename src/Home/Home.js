import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  CoordinatorLayout,
  BottomSheetBehavior
} from 'react-native-bottom-sheet-behavior';
// import Color from '../Public/Color';
const height = Dimensions.get('window').height;
class Home extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: 'Home'
  // });

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <CoordinatorLayout style={styles.coodinatorlayout}>
        <MapView
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
          }}
        />
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
                <FontAwesome5
                  style={styles.iconInput}
                  name="edit"
                  color="grey"
                  size={16}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Input your location"
                  onFocus={() =>
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_EXPANDED
                    )
                  }
                  onBlur={() => {
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_COLLAPSED
                    );
                  }}
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
                  style={styles.input}
                  placeholder="Input detail location"
                  onFocus={() =>
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_EXPANDED
                    )
                  }
                  onBlur={() => {
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_COLLAPSED
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.miniContainer}>
              <Text style={styles.textTitle}>Whats your problem ?</Text>
              <View style={[styles.wrapperForm, styles.wrapperDetailLocation]}>
                <FontAwesome5
                  style={styles.iconInput}
                  name="edit"
                  color="grey"
                  size={16}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Input your problem"
                  onFocus={() =>
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_EXPANDED
                    )
                  }
                  onBlur={() => {
                    this.refs.bottomSheet.setBottomSheetState(
                      BottomSheetBehavior.STATE_COLLAPSED
                    );
                  }}
                />
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
    padding: 10,
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
    margin: 16
  }
});
