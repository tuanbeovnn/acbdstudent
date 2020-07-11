import React, { Component } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from 'axios';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getStudentByUsername, getStudentCourses } from '../../services/student';
import { connect } from 'react-redux';
import { setupProfile } from '../../redux/actions';


const blue = '#265985';
class StudentSchedule extends Component {
    localizer = momentLocalizer(moment);
    TEACHER_ID = 14;

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {
            events: [],
            color: blue,
            username: params.username,
            courses: [],
            teacherId:''
        };
        this.onSelectEvent = this.onSelectEvent.bind(this);
    }

    componentDidMount() {
        this.getTimeTable();
        if (Object.keys(this.props.profile).length === 0) {
            getStudentByUsername(this.state.username).then(res => {
                this.setState({...res.data});
                this.fetchCourses(res.data.id);
                this.props.setupProfile(res.data);
                console.log(res.data);
            }).catch(error => {});
        } else {
            this.fetchCourses(this.props.profile.id);

        }
        
    }

    fetchCourses(id) {
        getStudentCourses(id).then(res => this.setState({
            courses: res.data,
        }));
    }
    async getTimeTable() {
        const res = await axios.get('https://dev.beeclear.app/api/learning/teacher-free-times/?teacherID=14');
        this.setState({
            events: res.data.map((item, index) => {
                return {
                    title: 'Sự kiện ' + index,
                    id: item.id,
                    start: new Date(item.date + ' ' + item.startTime),
                    end: new Date(item.date + ' ' + item.endTime),
                    backgroundColor: '#265985'
                }
            })
        });
    }

    async onSelectEvent(event) {
        var { events } = this.state;
        const arrayColor = ["#FFD712", "#265985"];
        const arrayNoti = ["bạn chắc chắn chưa", "hủy lịch"];
        var index = events.findIndex(e => e.id === event.id);
        var indexColor = arrayColor.findIndex(color => color === event.backgroundColor);
        indexColor = (indexColor + 1) % arrayColor.length;
        event.backgroundColor = arrayColor[indexColor]
        events[index] = {...event};
        window.alert(arrayNoti[indexColor]);
        this.setState({
            events:[...events],
        });
        console.log(event);
    }
    render() {
        var { events } = this.state;
        console.log(this.state.courses);
        return (
                <Calendar
                    selectable
                    localizer = {this.localizer}
                    events = {this.state.events}
                    defaultView = {Views.WEEK}
                    defaultDate = {new Date()}
                    onSelectEvent = {event => this.onSelectEvent(event)}
                    eventPropGetter = {e => ({
                        style: {
                            backgroundColor: e.backgroundColor,
                            borderRadius: '0px',
                            opacity: 0.8,
                            color: 'black',
                            border: '1px',
                            display: 'block'
                        }
                    })}
                />
        );
    }
}

const mapStateToProps = state => {
    return {profile: state.profile};
};

export default connect(mapStateToProps, { setupProfile }) (StudentSchedule);