import React from "react";
class NewAnswerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: "",
            username: "",
            answerEmpty: false,
        };
    }

    checkEmpty = () => {
        let error = false;
        if (this.state.answer.trim().length === 0) {
            this.setState({ answerEmpty: true });
            error = true;
        } else {
            this.setState({ answerEmpty: false });
        }

        if (!error) {
            this.props.onclick(this.state.answer);
        }
    };

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    render() {
        let errorMessage = "";
        if (this.state.answerEmpty) {
            errorMessage += "Answer can't be empty!\n";
        }

        return (
            <React.Fragment>
                <div id="post-new-answer" className="page">
                    <div id="new-ans-error">
                        {errorMessage.split("\n").map((str) => (
                            <p key={str}>{str}</p>
                        ))}
                    </div>

                    <h2>Answer Text</h2>
                    <textarea
                        type="text"
                        className="answer-textarea"
                        id="answer-textarea"
                        value={this.state.answer}
                        onChange={(e) => {
                            this.handleChange(e, "answer");
                        }}
                    ></textarea>

                    <button id="post-answer-button" onClick={this.checkEmpty}>
                        Post Answer
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default NewAnswerPage;
