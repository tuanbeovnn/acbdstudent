import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getStudentByUsername } from '../../services/student';
import { Link } from 'react-router-dom';
import './Profile.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { setupProfile } from '../../redux/actions';
import Constant from '../../Constant';

class Profile extends Component {

    constructor(props) {
        super(props);
        const { params } = this.props.match;
        this.state = {username: params.username};
    }

    componentDidMount() {
        if (Object.keys(this.props.profile).length === 0) {
            getStudentByUsername(this.state.username).then(res => {
                this.setState({...res.data});
                this.props.setupProfile(res.data);
            }).catch(error => {
            });
        }
    }

    getRandomGreeting(part) {
        if (part === 1) {
            return Constant.GREETING_PART_1[Math.floor(Math.random() * Constant.GREETING_PART_1.length)];
        }
        return Constant.GREETING_PART_2[Math.floor(Math.random() * Constant.GREETING_PART_2.length)];
    }

    render() {
        return (
            <Container className="dashboard">
                <h1>{this.getRandomGreeting(1)} {this.state.firstName} 👋👋👋 {this.getRandomGreeting(2)}</h1>
                <Row>
                    <Col md="6">
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    <FontAwesomeIcon icon="chalkboard-teacher" />
                                    Lessons
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Where you find your lessons with your lovely teacher's note to help improve your skills.
                                </Card.Text>
                                <Link to={'/profile/' + this.state.username + '/lessons'}>
                                    <Button variant="primary">Access</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md="6">
                        <Card>
                            <Card.Header>
                                <Card.Title>
                                    <FontAwesomeIcon icon="credit-card" />
                                    Courses & Payment
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Your courses detail and payment history
                                </Card.Text>
                                <Link to={'/profile/' + this.state.username + '/courses'}>
                                    <Button variant="primary">Access</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {profile: state.profile};
};

export default connect(mapStateToProps, { setupProfile })(Profile);