import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TextInput, Platform} from 'react-native';

const Divider = (props) => {
    return(
        <View style={styles.divider}/>
    );
}

class CardWithTextInput extends Component {


    renderTitle(isTextInput) {
        if (isTextInput) {
            return (
                <TextInput
                    onChangeText={(text) => this.props.onChangeHeaderText(text)}
                    value={this.props.headerText}
                    style={[styles.headerTextInput, styles.title]}
                />
            );
        }
        else {
            return (
                <Text style={styles.title}>{this.props.headerText}</Text>
            );
        }
    }


    renderHeader(isTextInput) {
        return(
            <View style={{ padding: 15 }}>
                {this.renderTitle(isTextInput)}
            </View>
        );
    }

    render() {

        //console.log(this.props.isTextInput);

        return(
            <View style={[styles.container, this.props.containerStyle]}>
                {this.renderHeader(this.props.isTextInput)}
                <Divider/>
                <View style={styles.insideContainer}>
                    {this.props.children}
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        margin: 15,
        marginBottom: 0,
        backgroundColor: 'white',
        borderColor: '#e1e8ee',
        borderWidth: 2,

    },
    divider: {
        height: 1,
        backgroundColor: '#e1e8ee',
        marginBottom: 15,
        marginLeft: 12,
        marginRight: 12,

    },
    headerTextInput: {
        height: 30,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, .2)',
        // borderColor: '#e1e8ee',
        // textAlign: 'center',
        borderRadius: 3,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#43484d',
        textAlign: 'center'
    },
    insideContainer: {
        padding: 10,
    }
});

export default CardWithTextInput;