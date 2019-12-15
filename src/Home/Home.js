import React, { Component } from 'react';
import { connect } from 'react-redux';
import Personal from './personal';
import Staff from './staff';

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return this.props.auth.role === 1 ? <Personal /> : <Staff />;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.authToken
});

export default connect(mapStateToProps)(Home);
