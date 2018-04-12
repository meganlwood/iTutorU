import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // 1.0.0-beta.30
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars'; // 1.17.0
import { Card } from 'react-native-elements'; // 0.19.0

import * as Actions from "../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";




class CalendarScreen extends Component {

    DATA = {}

    static navigationOptions = {
        title: 'Calendar'
    }

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            // data: props.data
        };
    }

    // Takes the calendar data passed in through redux and formats
    //  it so that the calendar can actually read it.
    componentWillMount() {
      var d = {
        items: {}
      };

      for (var i in this.props.cal) {
        var key = Object.keys(this.props.cal[i]);
        d.items[[key]] = this.props.cal[i][key];
      }
      this.DATA = d;
    }

    render() {
      console.log(JSON.stringify(this.DATA));
        return(
            <Agenda
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                selected={Date()}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
            />
        );
    }

    loadItems(day) {
        for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            this.state.items[strTime] =[];
            if (this.DATA.items[strTime]) {
                var h = this.DATA.items[strTime].sessions.length * 50;
                this.state.items[strTime].push({
                    times: this.DATA.items[strTime].sessions,
                    height: h,
                });
            }

        }

        const newItems = {};
        Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        this.setState({
            items: newItems
        });
    }

    renderItem(item) {
        const views = item.times.map((sesh, index) => {
            return (
                <View key={index}>
                    <Text style={styles.timeText}>{sesh.time}</Text>
                    <Text>{sesh.name}</Text>
                </View>
            );
        });

        return <View style={[styles.item, {height: item.height}]}>{views}</View>
    }

    renderEmptyDate() {
        return (
            <View></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'space-between',
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
    },
    timeText: {
        fontSize: 18,
        color: '#0093ff',
    }

});

function mapStateToProps(state, props) {
    return  {
        cal: state.calReducer.cal,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
