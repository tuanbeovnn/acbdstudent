import React, {Component} from 'react';

class Comment extends Component{
        render(){
        	var {question} = this.props;
            return (
                     <div className="title white">{question.noteTitle}</div>
                );
    }
}
export default Comment;