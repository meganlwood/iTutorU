import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // 1.0.0-beta.30
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars'; // 1.17.0
import { Card } from 'react-native-elements'; // 0.19.0




class CalendarScreen extends Component {

    DATA = {
        items: {
            '2018-04-08': {
                sessions: [
                    {
                        name: 'Bobby: Tutoring session with Casey',
                        time: '3:15-4:15',
                    },
                    {
                        name: 'Billy: Tutoring session with Casey',
                        time: '4:30-5:30',
                    }
                ]
            },
            '2018-04-15': {
                sessions: [
                    {
                        name: 'Billy: Tutoring session with Casey',
                        time: '3:30-4:30',
                    }
                ],
            },
            '2018-04-20': {
                sessions: [
                    {
                        name: 'More test data lalalalala this can be really really long and it still looks nice on the calendar',
                        time: '2:00-3:00',
                    },
                    {
                        name: 'Another session',
                        time: '1:00-2:00',
                    }
                ]
            }

        },
    }

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

    render() {
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

export default CalendarScreen;
