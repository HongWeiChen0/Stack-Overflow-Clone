import React from "react";
import Question from "./Question";
class QuestionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayingQuestions: [],
            pageNumber: 0,
            pageLimit: 0,
            loaded: false,
        };
    }

    componentDidMount() {
        this.setState({ loaded: false });
        this.setState({ pageNumber: 0 });
        this.getQuestions(this.state.pageNumber);
        let limit = Math.ceil(this.props.orderedQuestions.length / 5);
        this.setState({ pageLimit: limit });
        this.setState({ loaded: true });
    }

    getQuestions = (pageNumber) => {
        let allQuestions = this.props.orderedQuestions;
        let number = pageNumber * 5;
        let displayingQuestions = [];
        let counter = 0;
        for (
            let i = number;
            i < allQuestions.length && counter < 5;
            i++, counter++
        ) {
            displayingQuestions.push(allQuestions[i]);
        }
        this.setState({ displayingQuestions });
    };

    prevPage = () => {
        let currentPageNumber = this.state.pageNumber;
        if (currentPageNumber > 0) {
            currentPageNumber--;
        }
        this.setState({ pageNumber: currentPageNumber });
        this.getQuestions(currentPageNumber);
    };

    nextPage = () => {
        let currentPageNumber = this.state.pageNumber;
        if (currentPageNumber < this.state.pageLimit - 1) {
            currentPageNumber++;
        }
        this.setState({ pageNumber: currentPageNumber });
        this.getQuestions(currentPageNumber);
    };

    render() {
        if (!this.state.loaded) {
            return null;
        } else {
            const questions = this.state.displayingQuestions;
            return (
                <div id="all-questions" className="page">
                    <table id="questions-table">
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>
                                    <span id="qCount">
                                        {this.props.orderedQuestions.length}{" "}
                                        Questions
                                    </span>
                                </th>
                                <th style={{ width: "60%" }}>
                                    {this.props.title}
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
                            {questions.map((question) => {
                                if (this.props.profile) {
                                    return (
                                        <React.Fragment key={question._id}>
                                            <tr>
                                                <td>
                                                    <button
                                                        style={{
                                                            marginTop: "20px",
                                                        }}
                                                        className="profile-button"
                                                        onClick={() =>
                                                            this.props.onEdit(
                                                                question._id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        style={{
                                                            marginTop: "20px",
                                                        }}
                                                        className="profile-button-red"
                                                        onClick={() =>
                                                            this.props.onDelete(
                                                                question._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                            <Question
                                                key={question._id}
                                                question={question}
                                                tags={this.props.data.tags}
                                                onlinkclick={
                                                    this.props.onlinkclick
                                                }
                                            />
                                        </React.Fragment>
                                    );
                                } else {
                                    return (
                                        <Question
                                            key={question._id}
                                            question={question}
                                            tags={this.props.data.tags}
                                            onlinkclick={this.props.onlinkclick}
                                        />
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                    <div
                        className="center"
                        style={{ display: "table", margin: "0 auto" }}
                    >
                        <button
                            id={
                                this.state.pageNumber > 0
                                    ? "prev-button"
                                    : "prev-button-disable"
                            }
                            onClick={this.prevPage}
                        >
                            ⬅️Prev Page
                        </button>
                        <button
                            id={
                                this.state.pageNumber < this.state.pageLimit - 1
                                    ? "next-button"
                                    : "next-button-disable"
                            }
                            onClick={this.nextPage}
                        >
                            Next Page➡️
                        </button>
                    </div>
                </div>
            );
        }
    }
}

export default QuestionsPage;
