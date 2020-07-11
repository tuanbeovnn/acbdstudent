import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { getStudentByUsername, getStudentLessons, getTeacherFeedbacks } from '../../services/student';
import './Lessons.scss';
import { connect } from 'react-redux';
import { setupProfile } from '../../redux/actions';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Moment from 'react-moment';
import ReactStars from 'react-stars';

class Lessons extends Component {

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {
            username: params.username,
            lessons: [],
            showFeedbacksModal: false,
            lessonInModal: null,
        };
    }

    componentDidMount() {
        if (Object.keys(this.props.profile).length === 0) {
            getStudentByUsername(this.state.username).then(res => {
                this.setState({...res.data});
                this.fetchLessons(res.data.id);
                this.props.setupProfile(res.data);
                console.log(res.data);
            }).catch(error => {});
        } else {
            this.fetchLessons(this.props.profile.id);
        }
    }

    fetchLessons(id) {
        getStudentLessons(id).then(lessonsData => {
            this.setState({lessons: lessonsData.data});
            this.fetchFeedbacks(id);
        });
    }

    fetchFeedbacks(id) {
        getTeacherFeedbacks(id).then(feedbacksData => {
            const lessons = {};
            feedbacksData.data.forEach(feedback => {
                if (lessons[feedback.lesson] === undefined) {
                    lessons[feedback.lesson] = [];
                }
                lessons[feedback.lesson].push(feedback);
            });
            Object.keys(lessons).forEach(key => {
                lessons[key].sort((a, b) => {
                    if (a.question > b.question) {
                        return 1;
                    } else if (a.question < b.question) {
                        return -1;
                    }
                    return 0;
                });
            });
            this.setState({lessons: this.state.lessons.map(ls => {
                if (lessons[ls.id] !== undefined) {
                    return {...ls, feedbacks: lessons[ls.id]};
                }
                return ls;
            })});
        });
    }

    render() {
        return (
            <Container className="lessons-container">
                <Breadcrumb>
                    <Breadcrumb.Item href={'/profile/' + this.state.username}>Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item active>Lessons</Breadcrumb.Item>
                </Breadcrumb>

                <div className="lessons">
                    {this.state.lessons.map(lesson => (
                        <Card className="lesson" key={'lesson-' + lesson.id}>
                            <Card.Header>
                                <Card.Title>
                                    <FontAwesomeIcon icon="calendar-week" />
                                    <Moment format="DD/MM/YYYY">{lesson.createdAt}</Moment>
                                </Card.Title>
                                {lesson.feedbacks &&
                                    <div className="feedback-badge" onClick={() => this.setState({showFeedbacksModal: true, lessonInModal: lesson})}>
                                        <span className="bg-danger">{lesson.feedbacks.length}</span>
                                        <FontAwesomeIcon icon="comment-dots" className="feedback-icon text-danger" />
                                    </div>
                                }
                            </Card.Header>
                            <Card.Body>
                                <ReactPlayer url={lesson.video} width="100%" controls={true} />
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <Modal show={this.state.showFeedbacksModal} onHide={() => this.setState({showFeedbacksModal: false})}
                    className="lesson-feedbacks-modal" centered size="lg">
                    <Modal.Header closeButton >
                        <Modal.Title>
                            <span>Teacher's Feedbacks - Lesson</span>
                            <Moment format="DD/MM/YYYY">{this.state.lessonInModal?.createdAt}</Moment>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.lessonInModal?.feedbacks.map(feedback => (
                            <div className="feedback" key={'feedback-' + feedback.id}>
                                <div className="feedback-title">
                                    {feedback.questionTitle}
                                </div>
                                {feedback.score > 0 &&
                                <div className="feedback-rating">
                                    <ReactStars count={10} name="rating" size={20} color2={'#f8bc14'}
                                        value={feedback.score} edit={false}
                                    />
                                    ({feedback.score}/10)
                                </div>
                                }
                                <div className="feedback-note">{feedback.note}</div>
                            </div>
                        ))}
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {profile: state.profile};
};

export default connect(mapStateToProps, { setupProfile })(Lessons);