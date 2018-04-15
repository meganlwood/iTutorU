import React, { Component } from 'react';
import { WebView, ActivityIndicator } from 'react-native';

class WebViewPage extends Component {

  state = {
    url: ''
  }

  componentWillMount() {
    this.setState({ url: this.props.navigation.state.params.url });
  }

  render() {
    console.log(this.state.url);

    if (this.state.url == '') {
      return(
        <ActivityIndicator />
      );
    }
    else {
      return(
        <WebView
          source={{ uri: this.state.url }}
        />
      );
    }


  }

}

export default WebViewPage;
