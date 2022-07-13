import React from "react";
import { VscTriangleUp } from "react-icons/vsc";
import { VscTriangleDown } from "react-icons/vsc";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Comments from "./Commnets";
import Answer from "./Answer";
import AnswerComment from "./AnswerComment";
class AnswersPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            upvoted: false,
            downvoted: false,
            displayingQuestionComments: [],
            qcPageNumber: 0,
            qcPageLimit: 0,
            loaded: false,
            currentQuestion: "",
            qcText: "",

            displayingAnswers: [],
            ansPageNumber: 0,
            ansPageLimit: 0,
            allAnswers: [],
        };
    }

    componentDidMount() {
        this.setState({ loaded: false });
        let currentQuestion;
        for (let i = 0; i < this.props.data.questions.length; i++) {
            if (this.props.data.questions[i]._id === this.props.question) {
                currentQuestion = this.props.data.questions[i];
                this.setState({ currentQuestion });
                break;
            }
        }
        this.setState({ qcPageNumber: 0 });
        this.getQuestionComments(this.state.qcPageNumber, currentQuestion);
        let qclimit = Math.ceil(currentQuestion.comments.length / 3);
        this.setState({ qcPageLimit: qclimit });

        this.setState({ ansPageNumber: 0 });
        this.getAnswers(this.state.ansPageNumber, currentQuestion.answers);
        this.setState({ allAnswers: currentQuestion.answers });
        let ansLimit = Math.ceil(currentQuestion.answers.length / 5);
        this.setState({ ansPageLimit: ansLimit });

        this.setState({ loaded: true });
    }

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    getAnswers = (pageNumber, allAnswers) => {
        let number = pageNumber * 5;
        let displayingAnswers = [];
        let counter = 0;
        for (
            let i = number;
            i < allAnswers.length && counter < 5;
            i++, counter++
        ) {
            displayingAnswers.push(allAnswers[i]);
        }
        this.setState({ displayingAnswers });
    };

    getQuestionComments = (qcPageNumber, currentQuestion) => {
        let allComments = currentQuestion.comments;
        let number = qcPageNumber * 3;
        let displayingQuestionComments = [];
        let counter = 0;
        for (
            let i = number;
            i < allComments.length && counter < 3;
            i++, counter++
        ) {
            displayingQuestionComments.push(allComments[i]);
        }
        this.setState({ displayingQuestionComments });
    };

    prevPage = () => {
        let currentPageNumber = this.state.ansPageNumber;
        if (currentPageNumber > 0) {
            currentPageNumber--;
        }
        this.setState({ ansPageNumber: currentPageNumber });
        this.getAnswers(currentPageNumber, this.state.allAnswers);
    };

    nextPage = () => {
        let currentPageNumber = this.state.ansPageNumber;
        if (currentPageNumber < this.state.ansPageLimit - 1) {
            currentPageNumber++;
        }
        this.setState({ ansPageNumber: currentPageNumber });
        this.getAnswers(currentPageNumber, this.state.allAnswers);
    };

    qcPrevPage = () => {
        let currentPageNumber = this.state.qcPageNumber;
        if (currentPageNumber > 0) {
            currentPageNumber--;
        }
        this.setState({ qcPageNumber: currentPageNumber });
        this.getQuestionComments(currentPageNumber, this.state.currentQuestion);
    };

    qcNextPage = () => {
        let currentPageNumber = this.state.qcPageNumber;
        if (currentPageNumber < this.state.qcPageLimit - 1) {
            currentPageNumber++;
        }
        this.setState({ qcPageNumber: currentPageNumber });
        this.getQuestionComments(currentPageNumber, this.state.currentQuestion);
    };

    getMonthNumber = (num) => {
        switch (num) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "Mar";
            case 3:
                return "Apr";
            case 4:
                return "May";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Aug";
            case 8:
                return "Sep";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec";
            default:
                return null;
        }
    };

    getOn = (date) => {
        let ansDate = new Date(date);
        let ansMonth = ansDate.getMonth();
        return `${this.getMonthNumber(
            ansMonth
        )} ${ansDate.getDate()}, ${ansDate.getFullYear()}`;
    };

    getAt = (date) => {
        let ansDate = new Date(date);

        let time = "";
        let hour = ansDate.getHours();
        let minute = ansDate.getMinutes();

        if (minute < 10 && hour < 10) {
            time = `0${hour}:0${minute}`;
        } else if (minute < 10 && hour >= 10) {
            time = `${hour}:0${minute}`;
        } else if (minute >= 10 && hour < 10) {
            time = `0${hour}:${minute}`;
        } else {
            time = hour + ":" + minute;
        }

        return time;
    };

    notify = (notifyText) => {
        toast(notifyText, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    render() {
        let currentQuestion = this.state.currentQuestion;

        let date = new Date(currentQuestion.ask_date_time);
        let counter = 0;
        // eslint-disable-next-line
        let i = 0;
        if (!this.state.loaded) {
            return null;
        } else {
            return (
                <React.Fragment>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <div id="answers-heading" className="page">
                        <table id="questions-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "20%" }}>
                                        <span id="qCount" className="col1">
                                            {currentQuestion.answers.length}{" "}
                                            Answers
                                        </span>
                                        <span className="col1">
                                            {currentQuestion.views} Views
                                        </span>
                                    </th>
                                    <th style={{ width: "60%" }}>
                                        {currentQuestion.title}
                                    </th>
                                    <th style={{ width: "20%" }}>
                                        {this.props.userType === "user" ? (
                                            <button
                                                id="new-question-button"
                                                onClick={this.props.onclick}
                                            >
                                                Ask A Question
                                            </button>
                                        ) : (
                                            <span></span>
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            textAlign: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <div
                                            className="center"
                                            style={{
                                                display: "table",
                                                margin: "0 auto",
                                            }}
                                        >
                                            {this.props.userType === "user" ? (
                                                <VscTriangleUp
                                                    size={40}
                                                    color={
                                                        this.props.user.upvoted.includes(
                                                            this.props.question
                                                        )
                                                            ? "orange"
                                                            : "lightgray"
                                                    }
                                                    className="col1 vote-icon"
                                                    onClick={() => {
                                                        if (
                                                            this.props.user
                                                                .reputation <
                                                            100
                                                        ) {
                                                            this.notify(
                                                                "You need at least 100 reputation to vote"
                                                            );
                                                            return;
                                                        }
                                                        if (
                                                            !this.props.user.upvoted.includes(
                                                                this.props
                                                                    .question
                                                            )
                                                        ) {
                                                            this.props.onvote(
                                                                "up"
                                                            );
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <VscTriangleUp
                                                    size={40}
                                                    color={"lightgray"}
                                                    className="col1"
                                                />
                                            )}
                                        </div>
                                        <span className="col1">
                                            {currentQuestion.votes}
                                        </span>
                                        <div
                                            className="center"
                                            style={{
                                                display: "table",
                                                margin: "0 auto",
                                            }}
                                        >
                                            {this.props.userType === "user" ? (
                                                <VscTriangleDown
                                                    className="col1 vote-icon"
                                                    size={40}
                                                    color={
                                                        this.props.user.downvoted.includes(
                                                            this.props.question
                                                        )
                                                            ? "orange"
                                                            : "lightgray"
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            this.props.user
                                                                .reputation <
                                                            100
                                                        ) {
                                                            this.notify(
                                                                "You need at least 100 repuatation to vote"
                                                            );
                                                            return;
                                                        }
                                                        if (
                                                            !this.props.user.downvoted.includes(
                                                                this.props
                                                                    .question
                                                            )
                                                        ) {
                                                            this.props.onvote(
                                                                "down"
                                                            );
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <VscTriangleDown
                                                    size={40}
                                                    color={"lightgray"}
                                                    className="col1"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td>{currentQuestion.text}</td>
                                    <td>
                                        <span className="col3">
                                            Asked By {currentQuestion.asked_by}
                                        </span>
                                        <span className="col3">
                                            On {this.getOn(date)}
                                        </span>
                                        <span className="col3">
                                            At {this.getAt(date)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        {" "}
                                        {currentQuestion.tags.map((tag) => {
                                            if (counter === 8) {
                                                counter = 0;
                                                return (
                                                    <React.Fragment>
                                                        <span
                                                            className="tags"
                                                            key={tag._id}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                        <br></br>
                                                    </React.Fragment>
                                                );
                                            } else {
                                                counter++;
                                                return (
                                                    <span
                                                        className="tags"
                                                        key={tag._id}
                                                    >
                                                        {tag.name}
                                                    </span>
                                                );
                                            }
                                        })}
                                    </td>
                                    <td></td>
                                </tr>
                                <tr
                                    style={{
                                        borderBottom: "1px solid #000",
                                        marginTop: "0px",
                                    }}
                                >
                                    <td></td>
                                    <td>
                                        <h4>Comments:</h4>
                                        {this.state.displayingQuestionComments.map(
                                            (comment) => (
                                                <Comments
                                                    comment={comment}
                                                    key={comment._id}
                                                />
                                            )
                                        )}
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
                                                    this.state.qcPageNumber > 0
                                                        ? "prev-button"
                                                        : "prev-button-disable"
                                                }
                                                onClick={this.qcPrevPage}
                                            >
                                                ⬅️ Prev
                                            </button>
                                            <button
                                                style={{
                                                    marginTop: "0px",
                                                    marginBottom: "5px",
                                                }}
                                                id={
                                                    this.state.qcPageNumber <
                                                    this.state.qcPageLimit - 1
                                                        ? "next-button"
                                                        : "next-button-disable"
                                                }
                                                onClick={this.qcNextPage}
                                            >
                                                Next ➡️
                                            </button>
                                        </div>
                                        {this.props.userType === "user" ? (
                                            <textarea
                                                type="text"
                                                className="comment-textarea"
                                                placeholder="Type your comment here..."
                                                value={this.state.qcText}
                                                onChange={(e) => {
                                                    this.handleChange(
                                                        e,
                                                        "qcText"
                                                    );
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        if (
                                                            this.state.qcText
                                                                .length > 140
                                                        ) {
                                                            this.notify(
                                                                "Comment length can't be over 140 characters"
                                                            );
                                                            return;
                                                        }
                                                        if (
                                                            this.props.user
                                                                .reputation <
                                                            100
                                                        ) {
                                                            this.notify(
                                                                "You need at least 100 reputation to comment"
                                                            );
                                                            return;
                                                        }
                                                        this.props.onkeydown(
                                                            this.state.qcText,
                                                            "question",
                                                            this.state
                                                                .currentQuestion
                                                                ._id
                                                        );
                                                    }
                                                }}
                                            ></textarea>
                                        ) : (
                                            <span></span>
                                        )}
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="answers" className="page">
                        <table id="answers-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}></th>
                                    <th style={{ width: "70%" }}></th>
                                    <th style={{ width: "20%" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.displayingAnswers.map((answer) => {
                                    i++;
                                    return (
                                        <React.Fragment key={answer._id}>
                                            <tr key={answer._id}>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <div
                                                        className="center"
                                                        style={{
                                                            display: "table",
                                                            margin: "0 auto",
                                                        }}
                                                    >
                                                        {this.props.userType ===
                                                        "user" ? (
                                                            <VscTriangleUp
                                                                size={40}
                                                                color={
                                                                    this.props.user.upvoted.includes(
                                                                        answer._id
                                                                    )
                                                                        ? "orange"
                                                                        : "lightgray"
                                                                }
                                                                className="col1 vote-icon"
                                                                onClick={() => {
                                                                    if (
                                                                        this
                                                                            .props
                                                                            .user
                                                                            .reputation <
                                                                        100
                                                                    ) {
                                                                        this.notify(
                                                                            "You need at least 100 reputation to vote"
                                                                        );
                                                                        return;
                                                                    }
                                                                    if (
                                                                        !this.props.user.upvoted.includes(
                                                                            answer._id
                                                                        )
                                                                    ) {
                                                                        this.props.onvote(
                                                                            "up",
                                                                            answer._id
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <VscTriangleUp
                                                                size={40}
                                                                color={
                                                                    "lightgray"
                                                                }
                                                                className="col1"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="col1">
                                                        {answer.votes}
                                                    </span>
                                                    <div
                                                        className="center"
                                                        style={{
                                                            display: "table",
                                                            margin: "0 auto",
                                                        }}
                                                    >
                                                        {this.props.userType ===
                                                        "user" ? (
                                                            <VscTriangleDown
                                                                className="col1 vote-icon"
                                                                size={40}
                                                                color={
                                                                    this.props.user.downvoted.includes(
                                                                        answer._id
                                                                    )
                                                                        ? "orange"
                                                                        : "lightgray"
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        this
                                                                            .props
                                                                            .user
                                                                            .reputation <
                                                                        100
                                                                    ) {
                                                                        this.notify(
                                                                            "You need at least 100 repuatation to vote"
                                                                        );
                                                                        return;
                                                                    }
                                                                    if (
                                                                        !this.props.user.downvoted.includes(
                                                                            answer._id
                                                                        )
                                                                    ) {
                                                                        this.props.onvote(
                                                                            "down",
                                                                            answer._id
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <VscTriangleDown
                                                                size={40}
                                                                color={
                                                                    "lightgray"
                                                                }
                                                                className="col1"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <Answer
                                                    answer={answer}
                                                    getOn={this.getOn}
                                                    getAt={this.getAt}
                                                />
                                            </tr>
                                            <AnswerComment
                                                answer={answer}
                                                user={this.props.user}
                                                userType={this.props.userType}
                                                notify={this.notify}
                                                onkeydown={this.props.onkeydown}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div
                        className="new-ans-container"
                        style={{ width: "100%" }}
                    >
                        <div
                            className="center"
                            style={{ display: "table", margin: "0 auto" }}
                        >
                            {this.props.userType === "user" ? (
                                <button
                                    id="post-ans-button"
                                    style={{ marginTop: "20px" }}
                                    onClick={this.props.onanswerclick}
                                >
                                    Answer Question
                                </button>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    </div>
                    <div
                        className="center"
                        style={{ display: "table", margin: "0 auto" }}
                    >
                        <button
                            id={
                                this.state.ansPageNumber > 0
                                    ? "prev-button"
                                    : "prev-button-disable"
                            }
                            onClick={this.prevPage}
                        >
                            ⬅️Prev Page
                        </button>
                        <button
                            id={
                                this.state.ansPageNumber <
                                this.state.ansPageLimit - 1
                                    ? "next-button"
                                    : "next-button-disable"
                            }
                            onClick={this.nextPage}
                        >
                            Next Page➡️
                        </button>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default AnswersPage;
