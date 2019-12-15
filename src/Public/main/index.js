import { Component } from 'react';
import { connect } from 'react-redux';

class index extends Component {
  async componentDidMount() {
    if (this.props.auth) {
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  auth: state.auth.authToken
});

export default connect(mapStateToProps)(index);
