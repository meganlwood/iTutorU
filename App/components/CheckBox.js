import React, { Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


class CheckBox extends Component {


    onPress() {
        this.props.onPress();
    }

    renderIcon(checked) {

        var name = checked? 'check-square' : 'square';

        return <Icon name={name} size={15} style={{ marginRight: 10 }}/>
    }

    render() {
        return(
            <View>
                <TouchableOpacity
                    onPress={() => this.props.onPress()}
                    disabled={this.props.disabled}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        {this.renderIcon(this.props.checked)}
                        <Text style={{ fontSize: 15, width: this.props.textWidth }}>{this.props.text}</Text>
                    </View>


                </TouchableOpacity>


            </View>
        );

    }
}

export default CheckBox;