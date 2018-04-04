import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'; // 1.0.0-beta.30
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars'; // 1.17.0
import { Card } from 'react-native-elements'; // 0.19.0




class CalendarScreen extends Component {

    DATA = {
        items: {
            '2018-03-04': {
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
            '2018-02-27': {
                sessions: [
                    {
                        name: 'Billy: Tutoring session with Casey',
                        time: '3:30-4:30',
                    }
                ],
            },
            '2018-02-09': {
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
            items: {}
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
                // markingType={'period'}
                // markedDates={{
                //    '2017-05-08': {textColor: '#666'},
                //    '2017-05-09': {textColor: '#666'},
                //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                //    '2017-05-21': {startingDay: true, color: 'blue'},
                //    '2017-05-22': {endingDay: true, color: 'gray'},
                //    '2017-05-24': {startingDay: true, color: 'gray'},
                //    '2017-05-25': {color: 'gray'},
                //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                // monthFormat={'yyyy'}
                // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
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
            // if (this.DATA[strTime]) {
            //     this.state.items[strTime].push({
            //       name: this.DATA[strTime].name,
            //       time: this.DATA[strTime].time,
            //       height: 50,
            //     });
            // }

        }

        const newItems = {};
        Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        this.setState({
            items: newItems
        });



        // this.state.items[day.dateString] = [];
        // if (this.DATA[day.dateString]) {
        //   this.state.items[day.dateString].push({
        //     name: this.DATA[day.dateString].name,
        //     height: 50,
        //   });
        // }
        // const newItems = {};
        // Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        // this.setState({
        //   items: newItems
        // });
        // setTimeout(() => {
        //   for (let i = -15; i < 85; i++) {
        //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        //     const strTime = this.timeToString(time);
        //     if (!this.state.items[strTime]) {
        //       this.state.items[strTime] = [];
        //       const numItems = Math.floor(Math.random() * 5);
        //       for (let j = 0; j < numItems; j++) {
        //         this.state.items[strTime].push({
        //           name: 'Item for ' + strTime,
        //           height: Math.max(50, Math.floor(Math.random() * 150))
        //         });
        //       }
        //     }
        //   }
        //   const newItems = {};
        //   Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        //   this.setState({
        //     items: newItems
        //   });
        // }, 1000);
        // const time = day.time = day.timestamp + 3 * 24 * 60 * 60 * 1000;
        // const strTime = this.timeToString(time);
        // this.state.items[strTime] = [];
        // this.state.items[strTime].push({
        //   name: 'Tutoring session ' + strTime,
        //   height: 50,
        // });
        // const newItems = {};
        //   Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        //   this.setState({
        //     items: newItems
        //   });
        // console.log(`Load Items for ${day.year}-${day.month}`);


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
            // <View style={styles.emptyDate}><Text>No session scheduled.</Text></View>
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
