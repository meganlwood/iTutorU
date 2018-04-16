import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SimpleFormComponent from '../components/SimpleFormComponent';
import { Button } from 'react-native-elements';
import { changeEmail } from '../FirebaseManager';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as Actions from "../actions";


class ChangeEmail extends Component {

  state = {
    email: '',
    error: '',
  }

  onPressReset() {
    changeEmail(this.props.user, this.state.email)
    .then(
      this.props.navigation.goBack()
    )
    .catch(error => {
      this.setState({ error: error.message });
    });
  }

  render() {
    return (
      <View>
        <SimpleFormComponent
          title={"Enter new email address"}
          onChangeText={(text) => this.setState({ email: text })}
          keyboard={"email-address"}
          errorMessage={this.state.error}
        />
        <Button
          title={'Reset Email'}
          onPress={() => this.onPressReset()}
        />
      </View>
    );
  }

}
<<<<<<< HEAD
export default ChangeEmail;
=======

// we want to have the tutor data and the student data
function mapStateToProps(state, props) {
    return  {
      user: state.authReducer.user,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
>>>>>>> 550ddd982d80bc6930f3fa580eda408a4f681685
