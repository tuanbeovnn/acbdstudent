import React, {Component} from 'react';
import './../App.css';


class Question extends Component{
    render() {
        const {question, qIndex} = this.props;
        return (
            <div id="content">
                <div className="title">{qIndex + 1}. {question.question}</div>
                <div className="question">{question.description}</div>
            </div>
        );
    }
}

export default Question;