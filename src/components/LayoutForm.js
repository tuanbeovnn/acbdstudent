import React, {Component} from 'react';
import './Form.css';
import Question from './Question';
import Comment from './Comment';
import ReactStars from 'react-stars';
import axios from 'axios';

class LayoutForm extends Component {

    STUDENT_ID = 5;
    TEACHER_ID = 14;

    constructor(props) {
        super(props)
        this.state = {
            index : 0,
            id: '',
            questions : [],
            txtMessage: '',
            rating: 0,
            loading: false,
            message: '',
        }

        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onChange = this.onChange.bind(this);
        this.ratingChanged = this.ratingChanged.bind(this);
        this.refreshDefaultValues = this.refreshDefaultValues.bind(this);
        this.saveCurrentAnswers = this.saveCurrentAnswers.bind(this);
    }

    componentDidMount() {
        this.getQuestions();
    }

    async getQuestions() {
        const res = await axios.get('https://dev.beeclear.app/api/resources/feedback-questions/?usedBy=student');
        this.setState({questions : res.data});
    }

    onPrevious(event) {
        event.preventDefault();
        if (this.state.index - 1 >= 0) {
            this.saveCurrentAnswers();
            this.refreshDefaultValues(this.state.index - 1);
        }
    }

    async onNext(event) {
        event.preventDefault();
        if (this.state.index + 1 < this.state.questions.length) {
            this.saveCurrentAnswers();
            this.refreshDefaultValues(this.state.index + 1);
        }
    }

    /**
     * Save current answers
     */
    async saveCurrentAnswers() {
        const currentIndex = this.state.index;
        if (this.state.txtMessage !== '' || this.state.rating > 0) {
            const currentQuestion = this.state.questions[currentIndex];
            let res;
            if (!currentQuestion.hasOwnProperty('feedback')) {
                res = await axios.post('https://dev.beeclear.app/api/resources/student-feedbacks/', {
                    note: this.state.txtMessage,
                    score: this.state.rating,
                    student: this.STUDENT_ID,
                    teacher: this.TEACHER_ID,
                    question: this.state.questions[this.state.index].id,
                });
            } else {
                res = await axios.patch('https://dev.beeclear.app/api/resources/student-feedbacks/' + currentQuestion.feedback.id + '/', {
                    note: this.state.txtMessage,
                    score: this.state.rating,
                });
            }
            this.setState({
                questions: this.state.questions.map((q, index) => {
                    if (index === currentIndex) {
                        return {...q, feedback: res.data};
                    }
                    return q;
                })
            });
        }
    }

    /**
     * Render the rating stars and note box default values for the current question
     */
    refreshDefaultValues(questionIndex) {
        const question = this.state.questions[questionIndex];
        this.setState({
            index: questionIndex,
            rating: question.hasOwnProperty('feedback') ? question.feedback.score : 0,
            txtMessage: question.hasOwnProperty('feedback') ? question.feedback.note : '',
        });
    }

    onChange(e) {
        var target = e.target;
        var name = target.name;
        var value = target.value;
        this.setState({[name]: value});
    }

    onSave = (event) =>{
        event.preventDefault();
    }

    loadOrShowMsg = () => {
        if (this.state.loading) {
            return <p>Loading....</p>;
        } else {
            return <p>{this.state.message}</p>;
        }
    }

    ratingChanged(value) {
        this.setState({
            rating: value
        }, () => console.log(this.state.rating))
    }

    render(){
        var { questions } = this.state;
        return (
                <div className="container">
                        <form id="myForm" onSubmit = {this.onSave}>
                            {questions.length ? <Question question = {this.state.questions[this.state.index]} qIndex={this.state.index}/> : "No question"}

                            <div id="content" className="feedback">
                                <div className="title white">Chấm điểm</div>
                                <ReactStars
                                    count={10}
                                    name="rating"
                                    size={40}
                                    color2={'#ffd700'}
                                    value={this.state.rating}
                                    onChange={(e) => this.ratingChanged(e)}
                                />
                            </div>

                            <div id="content" className="feedback">
                                {questions.length ? <Comment question = {this.state.questions[this.state.index]}/> : "No comment"}
                                <div className="question">
                                    <input  className="text-line"
                                        type="text"
                                        placeholder="Your answer"
                                        name="txtMessage"
                                        value={this.state.txtMessage || ""}
                                        onChange = {this.onChange}
                                    />
                                </div>
                            </div>

                            {this.state.index > 0 && <button type="submit" className="btn btn-primary" onClick = {this.onPrevious}>Previous</button>}
                            <button type="submit" className="btn btn btn-success" onClick = {this.onNext}>Next</button>
                        </form>
                </div>
            );
    }
}

export default LayoutForm;