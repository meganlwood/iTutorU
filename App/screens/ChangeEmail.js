import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SimpleFormComponent } from '../components/SimpleFormComponent';
import { Button } from 'react-native-elements';
import { changeEmail } from '../FirebaseManager';


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
      this.setState({ error: error.message })
    })
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
          onPress={() => onPressReset()}
        />
      </View>
    );
  }

}
export default ChangeEmail;
