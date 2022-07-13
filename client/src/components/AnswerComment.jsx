import React from "react";
import Comments from "./Commnets";
class AnswerComment extends React.Component {
    state = {
        acDisplaying: [],
        acText: "",
        acPageNumber: 0,
        acPageLimit: 0,
        loaded: false,
    };

    componentDidMount() {
        this.setState({ loaded: false });
        this.getAnswerComments(this.state.acPageNumber);
        let aclimit = Math.ceil(this.props.answer.comments.length / 3);
        this.setState({ acPageLimit: aclimit });
        this.setState({ loaded: true });
    }

    acPrevPage = () => {
        let currentPageNumber = this.state.acPageNumber;
        if (currentPageNumber > 0) {
            currentPageNumber--;
        }
        this.setState({ acPageNumber: currentPageNumber });
        this.getAnswerComments(currentPageNumber);
    };

    acNextPage = () => {
        let currentPageNumber = this.state.acPageNumber;
        if (currentPageNumber < this.state.acPageLimit - 1) {
            currentPageNumber++;
        }
        this.setState({ acPageNumber: currentPageNumber });
        this.getAnswerComments(currentPageNumber);
    };

    getAnswerComments = (acPageNumber) => {
        let currentAnswer = this.props.answer;
        let allComments = currentAnswer.comments;
        let number = acPageNumber * 3;
        let displayingAnswerComments = [];
        let counter = 0;
        for (
            let i = number;
            i < allComments.length && counter < 3;
            i++, counter++
        ) {
            displayingAnswerComments.push(allComments[i]);
        }
        this.setState({ acDisplaying: displayingAnswerComments });
    };

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    render() {
        if (this.state.loaded) {
            return (
                <tr
                    style={{
                        borderBottom: "1px solid #000",
                        marginTop: "0px",
                    }}
                >
                    <td></td>
                    <td>
                        <h4>Comments:</h4>
                        {this.state.acDisplaying.map((comment) => (
                            <Comments comment={comment} key={comment._id} />
                        ))}
                        <div
                            className="center"
                            style={{
                                display: "table",
                                margin: "0 auto",
                            }}
                        >
                            <button
                                style={{
                                    marginTop: "0px",
                                    marginBottom: "5px",
                                }}
                                id={
                                    this.state.acPageNumber > 0
                                        ? "prev-button"
                                        : "prev-button-disable"
                                }
                                onClick={() => this.acPrevPage()}
                            >
                                ⬅️ Prev
                            </button>
                            <button
                                style={{
                                    marginTop: "0px",
                                    marginBottom: "5px",
                                }}
                                id={
                                    this.state.acPageNumber <
                                    this.state.acPageLimit - 1
                                        ? "next-button"
                                        : "next-button-disable"
                                }
                                onClick={() => this.acNextPage()}
                            >
                                Next ➡️
                            </button>
                        </div>
                        {this.props.userType === "user" ? (
                            <textarea
                                type="text"
                                className="comment-textarea"
                                placeholder="Type your comment here..."
                                value={this.state.acText}
                                onChange={(e) => {
                                    this.handleChange(e, "acText");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        if (this.state.acText.length > 140) {
                                            this.props.notify(
                                                "Comment length can't be over 140 characters"
                                            );
                                            return;
                                        }
                                        if (this.props.user.reputation < 100) {
                                            this.props.notify(
                                                "You need at least 100 reputation to comment"
                                            );
                                            return;
                                        }
                                        this.props.onkeydown(
                                            this.state.acText,
                                            "answer",
                                            this.props.answer._id
                                        );
                                    }
                                }}
                            ></textarea>
                        ) : (
                            <span></span>
                        )}
                    </td>
                </tr>
            );
        } else {
            return null;
        }
    }
}

export default AnswerComment;
