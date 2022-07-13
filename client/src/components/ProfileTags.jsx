import React from "react";
class ProfileTags extends React.Component {
    getTagsRow = () => {
        let result = [];
        let tags = this.props.filteredTags;
        for (let i = 0; i < tags.length; i++) {
            if (3 - (tags.length - i) <= 0) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let questionCount2 = this.getQuestionCount(tags[i + 1]._id);
                let questionCount3 = this.getQuestionCount(tags[i + 2]._id);
                let tag1name = tags[i].name;
                let tag2name = tags[i + 1].name;
                let tag3name = tags[i + 2].name;
                result.push(
                    <tr key={tags[i].name}>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag1name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag1name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i].name}</span>
                            <span className="question-count">
                                {questionCount1} questions
                            </span>
                        </td>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag2name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag2name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i + 1].name}</span>
                            <span className="question-count">
                                {questionCount2} questions
                            </span>
                        </td>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag3name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag3name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i + 2].name}</span>
                            <span className="question-count">
                                {questionCount3} questions
                            </span>
                        </td>
                    </tr>
                );
                i += 2;
            } else if (3 - (tags.length - i) === 1) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let questionCount2 = this.getQuestionCount(tags[i + 1]._id);
                let tag1name = tags[i].name;
                let tag2name = tags[i + 1].name;
                result.push(
                    <tr key={tags[i].name}>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag1name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag1name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i].name}</span>
                            <span className="question-count">
                                {questionCount1} questions
                            </span>
                        </td>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag2name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag2name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i + 1].name}</span>
                            <span className="question-count">
                                {questionCount2} questions
                            </span>
                        </td>
                    </tr>
                );
                i += 1;
            } else if (3 - (tags.length - i) === 2) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let tag1name = tags[i].name;
                result.push(
                    <tr key={tags[i].name}>
                        <td className="tag-box">
                            <button
                                className="profile-button"
                                onClick={() => this.props.onEdit(tag1name)}
                            >
                                Edit
                            </button>
                            <button
                                className="profile-button-red"
                                onClick={() => this.props.onDelete(tag1name)}
                            >
                                Delete
                            </button>
                            <span className="tagName">{tags[i].name}</span>
                            <span className="question-count">
                                {questionCount1} questions
                            </span>
                        </td>
                    </tr>
                );
            }
        }
        return result;
    };

    getQuestionCount = (tid) => {
        let count = 0;
        let questions = this.props.data.questions;
        for (let i = 0; i < questions.length; i++) {
            let tagIds = this.getTagIds(questions[i]);
            for (let j = 0; j < tagIds.length; j++) {
                if (tagIds[j] === tid) {
                    count++;
                }
            }
        }
        return count;
    };

    getTagIds = (question) => {
        let ids = [];
        let tags = question.tags;
        for (let i = 0; i < tags.length; i++) {
            ids.push(tags[i]._id);
        }
        return ids;
    };

    render() {
        if (this.props.filteredTags.length === 0) {
            return (
                <h1 className="profile">You haven't created any tags yet.</h1>
            );
        } else {
            return (
                <React.Fragment>
                    <h1 className="profile">Tags You've Created</h1>
                    <div id="all-tags" className="page">
                        <table id="tags-table-heading">
                            <thead>
                                <tr>
                                    <th style={{ width: "20%" }}>
                                        <span id="tagCount">
                                            {this.props.filteredTags.length}{" "}
                                            Tags
                                        </span>
                                    </th>
                                    <th style={{ width: "60%" }}>
                                        Tags created by you
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
                        </table>
                    </div>
                    <div>
                        <table id="tags-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "33%" }}></th>
                                    <th style={{ width: "33%" }}></th>
                                    <th style={{ width: "33%" }}></th>
                                </tr>
                            </thead>
                            <tbody>{this.getTagsRow()}</tbody>
                        </table>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default ProfileTags;
