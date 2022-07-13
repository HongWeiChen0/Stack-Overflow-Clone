import React from "react";
class Answer extends React.Component {
    render() {
        let answer = this.props.answer;
        return (
            <React.Fragment>
                <td>{answer.text}</td>
                <td>
                    <span className="col3">Ans By {answer.ans_by}</span>
                    <span className="col3">
                        On {this.props.getOn(answer.ans_date_time)}
                    </span>
                    <span className="col3">
                        At {this.props.getAt(answer.ans_date_time)}
                    </span>
                </td>
            </React.Fragment>
        );
    }
}

export default Answer;
