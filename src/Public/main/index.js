import { Component } from 'react';
import { connect } from 'react-redux';

import { switchLanguage } from '../I18n';

class index extends Component {
  async componentDidMount() {
    if (this.props.landing.first) {
      this.props.navigation.navigate('Landing');
    } else if (this.props.authPersist.session_key) {
      await switchLanguage(this.props.landing.language);
      this.props.navigation.navigate('Home');
    } else {
      await switchLanguage(this.props.landing.language);
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => ({
  landing: state.landing,
  authPersist: state.authPersist.profile
});

export default connect(mapStateToProps)(index);
