/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Provider } from 'react-redux';
import store from './App/store';
import Home from "./App/screens/ParentSide/Home";
import Router from "./App/Router";

export default class App extends Component {



  render() {
    return (
      <Provider store={store}>

         <Router
             signedIn={false}
         />

      </Provider>
    );
  }
}

const styles = StyleSheet.create({

});
