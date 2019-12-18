import React, { Component } from 'react';
import { connect } from 'react-redux';
import Personal from './personal';
import Staff from './staff';
import Main from '../Public/main';

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return this.props.auth.role === 1 ? (
      <Personal navigation={this.props.navigation} />
    ) : this.props.auth.role === 2 ? (
      <Staff />
    ) : (
      <Main navigation={this.props.navigation} />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth.authToken
});

export default connect(mapStateToProps)(Home);
