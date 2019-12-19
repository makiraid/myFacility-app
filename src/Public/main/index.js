import { Component } from 'react';
import { connect } from 'react-redux';

class index extends Component {
  async componentDidMount() {
    if (this.props.auth === '') {
      this.props.navigation.navigate('Auth');
    } else {
      this.props.navigation.navigate('App');
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
