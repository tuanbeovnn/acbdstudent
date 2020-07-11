import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { getStudentByUsername, getStudentCourses } from '../../services/student';
import './Courses.scss';
import { connect } from 'react-redux';
import { setupProfile } from '../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import Moment from 'react-moment';

class Courses extends Component {

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {
            username: params.username,
            courses: [],
        };
    }

    componentDidMount() {
        if (Object.keys(this.props.profile).length === 0) {
            getStudentByUsername(this.state.username).then(res => {
                this.setState({...res.data});
                this.fetchCourses(res.data.id);
                this.props.setupProfile(res.data);
            }).catch(error => {});
        } else {
            this.fetchCourses(this.props.profile.id);
        }
    }

    fetchCourses(id) {
        getStudentCourses(id).then(res => this.setState({courses: res.data}));
    }

    formatPaymentAmount(amount) {
        amount = amount.toString();
        let result = '';
        for (let i = 0; i < amount.length; i++) {
            result = amount[amount.length - i - 1] + result;
            if (i % 3 === 2) {
                result = ' ' + result;
            }
        }
        return result;
    }

    render() {
        return (
            <Container className="courses-container">
                <Breadcrumb>
                    <Breadcrumb.Item href={'/profile/' + this.state.username}>Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item active>Courses & Payment</Breadcrumb.Item>
                </Breadcrumb>

                <div className="courses">
                    {this.state.courses.map(course => (
                        <Card className="course" key={'course-' + course.id}>
                            <Card.Header>
                                <Card.Title>
                                    {course.teacherInfo.avatar && (
                                        <div className="avatar">
                                            <img src={course.teacherInfo.avatar} className="teacher-avatar"/>
                                        </div>
                                    )}
                                    <div className="teacher-name">
                                        <div>Teacher</div>
                                        <div>{course.teacherInfo.firstName} {course.teacherInfo.lastName}</div>
                                    </div>
                                </Card.Title>
                                {course.feedbacks &&
                                    <div className="feedback-badge" onClick={() => this.setState({showFeedbacksModal: true, courseInModal: course})}>
                                        <span className="bg-danger">{course.feedbacks.length}</span>
                                        <FontAwesomeIcon icon="comment-dots" className="feedback-icon text-danger" />
                                    </div>
                                }
                            </Card.Header>
                            <Card.Body>
                                <div className="info">
                                    <div>
                                        <FontAwesomeIcon icon="info-circle" className="text-info" />
                                        Minutes per session</div>
                                    <div>{course.nbMinutesPerSession}'</div>
                                </div>
                                <div className="info">
                                    <div>
                                        <FontAwesomeIcon icon="info-circle" className="text-info" />
                                        Sessions per week
                                    </div>
                                    <div>{course.nbSessionsPerWeek}</div>
                                </div>
                                <div className="info">
                                    <div>
                                        <FontAwesomeIcon icon="info-circle" className="text-info"/>
                                        Number of months
                                    </div>
                                    <div>{course.nbMonths}</div>
                                </div>
                                <div className="info">
                                    <div>
                                        <FontAwesomeIcon icon="check-circle" className="text-success" />
                                        Payment
                                    </div>
                                    <div>{this.formatPaymentAmount(course.paymentAmount)} vnđ on <Moment format="DD/MM/YYYY">{course.paymentDate}</Moment></div>
                                </div>
                                {course.startingPoint && (
                                    <div className="info info-text">
                                        <div>
                                            <FontAwesomeIcon icon="info-circle" className="text-info"/>
                                            Starting point
                                        </div>
                                        <div>{course.startingPoint}</div>
                                    </div>
                                )}
                                {course.objective && (
                                    <div className="info info-text">
                                        <div>
                                            <FontAwesomeIcon icon="info-circle" className="text-info"/>
                                            Objective
                                        </div>
                                        <div>{course.objective}</div>
                                    </div>
                                )}
                                {course.content && (
                                    <div className="info info-text">
                                        <div>
                                            <FontAwesomeIcon icon="info-circle" className="text-info"/>
                                            Content
                                        </div>
                                        <div>{course.content}</div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {profile: state.profile};
};

export default connect(mapStateToProps, { setupProfile })(Courses);