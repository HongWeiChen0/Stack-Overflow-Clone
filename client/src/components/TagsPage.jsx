import React from "react";
class TagsPage extends React.Component {
    getTagsRow = () => {
        let result = [];
        let listenerCount = 0;
        let tags = this.props.data.tags;
        let key = 0;
        for (let i = 0; i < tags.length; i++) {
            if (3 - (tags.length - i) <= 0) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let questionCount2 = this.getQuestionCount(tags[i + 1]._id);
                let questionCount3 = this.getQuestionCount(tags[i + 2]._id);
                let name1 = tags[i].name;
                let name2 = tags[i + 1].name;
                let name3 = tags[i + 2].name;
                result.push(
                    <tr key={key++}>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name1);
                                }}
                                key={key++}
                            >
                                {tags[i].name}
                            </span>
                            <span className="question-count" key={key++}>
                                {questionCount1} questions
                            </span>
                        </td>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name2);
                                }}
                                key={key++}
                            >
                                {tags[i + 1].name}
                            </span>
                            <span className="question-count" key={key++}>
                                {questionCount2} questions
                            </span>
                        </td>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name3);
                                }}
                                key={key++}
                            >
                                {tags[i + 2].name}
                            </span>
                            <span className="question-count" key={key++}>
                                {questionCount3} questions
                            </span>
                        </td>
                    </tr>
                );
                i += 2;
            } else if (3 - (tags.length - i) === 1) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let questionCount2 = this.getQuestionCount(tags[i + 1]._id);
                let name1 = tags[i].name;
                let name2 = tags[i + 1].name;
                result.push(
                    <tr key={key++}>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name1);
                                }}
                                key={key++}
                            >
                                {tags[i].name}
                            </span>
                            <span className="question-count" key={key++}>
                                {questionCount1} questions
                            </span>
                        </td>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name2);
                                }}
                                key={key++}
                            >
                                {tags[i + 1].name}
                            </span>
                            <span className="question-count" key={key++}>
                                {questionCount2} questions
                            </span>
                        </td>
                    </tr>
                );
                i += 1;
            } else if (3 - (tags.length - i) === 2) {
                let questionCount1 = this.getQuestionCount(tags[i]._id);
                let name1 = tags[i].name;
                result.push(
                    <tr key={key++}>
                        <td className="tag-box" key={key++}>
                            <span
                                id={`tag${listenerCount++}`}
                                className="tagName"
                                onClick={() => {
                                    this.props.ontagclick(name1);
                                }}
                                key={key++}
                            >
                                {tags[i].name}
                            </span>
                            <span className="question-count" key={key++}>
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
        return (
            <React.Fragment>
                <div id="all-tags" className="page">
                    <table id="tags-table-heading">
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>
                                    <span id="tagCount">
                                        {this.props.data.tags.length} Tags
                                    </span>
                                </th>
                                <th style={{ width: "60%" }}>All Tags</th>
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

export default TagsPage;
