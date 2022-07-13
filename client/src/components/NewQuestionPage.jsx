import React from "react";
import axios from "axios";
class NewQuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            question: "",
            tags: "",
            summary: "",
            titleEmpty: false,
            titleLong: false,
            questionEmpty: false,
            tagsEmpty: false,
            summaryLong: false,
            tagLowRep: false,
        };
    }

    checkExistingTag = async (tag) => {
        let tagname = tag;
        let response = await axios.get(
            `http://localhost:8000/posts/tag/find/${tagname}`
        );
        if (response.data !== null) {
            return true;
        } else {
            return false;
        }
    };

    checkEmpty = async () => {
        let error = false;
        let tagsEmpty = false;
        if (this.state.title.trim().length === 0) {
            this.setState({ titleEmpty: true });
            error = true;
        } else {
            this.setState({ titleEmpty: false });
        }
        if (this.state.title.length > 50) {
            this.setState({ titleLong: true });
            error = true;
        } else {
            this.setState({ titleLong: false });
        }
        if (this.state.question.length === 0) {
            this.setState({ questionEmpty: true });
            error = true;
        } else {
            this.setState({ questionEmpty: false });
        }
        if (this.state.tags.trim().length === 0) {
            this.setState({ tagsEmpty: true });
            tagsEmpty = true;
            error = true;
        } else {
            tagsEmpty = false;
            this.setState({ tagsEmpty: false });
        }
        if (this.state.summary.trim().length > 140) {
            this.setState({ summaryLong: true });
            error = true;
        } else {
            this.setState({ summaryLong: false });
        }

        if (!tagsEmpty) {
            this.setState({ tagLowRep: false });
            let tagsString = this.state.tags.trim();
            let tagEntered = tagsString.split(/[ ]+/);
            for (let i = 0; i < tagEntered.length; i++) {
                let existing = await this.checkExistingTag(
                    tagEntered[i].toLowerCase()
                );
                if (existing === false) {
                    if (this.props.user.reputation <= 100) {
                        this.setState({ tagLowRep: true });
                        error = true;
                    } else {
                        this.setState({ tagLowRep: false });
                    }
                }
            }
        }

        if (!error) {
            this.props.onclick(
                this.state.title,
                this.state.question,
                this.state.summary,
                this.state.tags,
                this.props.user.name,
                this.props.user._id
            );
        }
    };

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    render() {
        let errorMessage = "";
        if (this.state.titleEmpty) {
            errorMessage += "Title can't be empty!\n";
        }
        if (this.state.titleLong) {
            errorMessage += "Title can't be over 50 characters!\n";
        }
        if (this.state.questionEmpty) {
            errorMessage += "Question text can't be empty!\n";
        }
        if (this.state.tagsEmpty) {
            errorMessage += "Tags can't be empty!\n";
        }
        if (this.state.summaryLong) {
            errorMessage += "Summary can't be over 140 characters\n";
        }
        if (this.state.tagLowRep) {
            errorMessage += "Reputation must be over 100 to create new tag\n";
        }
        return (
            <div id="ask-new-question" className="page">
                <div id="new-question-error">
                    {errorMessage.split("\n").map((str) => (
                        <p key={str}>{str}</p>
                    ))}
                </div>
                <h2>Question Title</h2>
                <p className="question-instruction">
                    Title should not be more than 50 characters.
                </p>
                <textarea
                    type="text"
                    className="question-textarea"
                    id="title-textarea"
                    value={this.state.title}
                    onChange={(e) => {
                        this.handleChange(e, "title");
                    }}
                ></textarea>

                <h2>Question Summary</h2>
                <p className="question-instruction">
                    Summary should not be more than 140 characters
                </p>
                <textarea
                    type="text"
                    className="question-textarea"
                    id="question-textarea"
                    value={this.state.summary}
                    onChange={(e) => {
                        this.handleChange(e, "summary");
                    }}
                ></textarea>

                <h2>Question Text</h2>
                <p className="question-instruction">Add details.</p>
                <textarea
                    type="text"
                    className="question-textarea"
                    id="question-textarea"
                    value={this.state.question}
                    onChange={(e) => {
                        this.handleChange(e, "question");
                    }}
                ></textarea>

                <h2>Tags</h2>
                <p className="question-instruction">
                    Add Keywords separated by whitespace.
                </p>
                <textarea
                    type="text"
                    className="question-textarea"
                    id="tags-textarea"
                    style={{ height: "50px" }}
                    value={this.state.tags}
                    onChange={(e) => {
                        this.handleChange(e, "tags");
                    }}
                ></textarea>

                <button id="post-question-button" onClick={this.checkEmpty}>
                    Post Question
                </button>
            </div>
        );
    }
}

export default NewQuestionPage;
