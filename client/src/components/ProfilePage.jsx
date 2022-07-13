import React from "react";
import axios from "axios";
import QuestionsPage from "./QuestionsPage";
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            filteredQuestions: [],
            filteredAnswers: [],
            filteredTags: [],
        };
    }

    componentDidMount = async () => {
        this.setState({ loaded: false });
        let filteredQuestions = await this.getQuestions();
        this.setState({ filteredQuestions });
        let filteredAnswers = await this.getAnswers();
        this.setState({ filteredAnswers });
        let filteredTags = await this.getTags();
        this.setState({ filteredTags });
        this.setState({ loaded: true });
    };

    getQuestions = async () => {
        let questions = await axios.get(
            `http://localhost:8000/posts/question/byUser/${this.props.user._id}`
        );
        questions = questions.data;
        return questions;
    };

    getAnswers = async () => {
        let answers = await axios.get(
            `http://localhost:8000/posts/answer/byUser/${this.props.user._id}`
        );
        answers = answers.data;
        return answers;
    };

    getTags = async () => {
        let tags = await axios.get(
            `http://localhost:8000/posts/tag/byUser/${this.props.user._id}`
        );
        tags = tags.data;
        return tags;
    };

    render() {
        if (!this.state.loaded) {
            return null;
        } else {
            let filteredQuestions = this.state.filteredQuestions;

            let registerDate = Date.parse(this.props.user.registerationTime);
            let currentDate = Date.now();
            let days = currentDate - registerDate;
            days /= 1000;
            days /= 60;
            days /= 60;
            days /= 24;
            days = Math.ceil(days);

            return (
                <React.Fragment>
                    <table id="profile-table">
                        <thead>
                            <tr>
                                <th style={{ width: "70%" }}></th>
                                <th style={{ width: "30%" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <h1 className="profile">
                                        {this.props.user.name}
                                    </h1>
                                    <h3 className="profile">
                                        Member for: {days} days
                                    </h3>
                                    <h3 className="profile">
                                        Reputation: {this.props.user.reputation}
                                    </h3>
                                    <h3 className="profile"></h3>
                                </td>
                                <td>
                                    <h3
                                        className="sidebar"
                                        onClick={() => {
                                            this.props.profileAnswersClick(
                                                this.state.filteredAnswers
                                            );
                                        }}
                                    >
                                        View all answers posted by you
                                    </h3>
                                    <h3
                                        className="sidebar"
                                        onClick={() => {
                                            this.props.profileTagsClick(
                                                this.state.filteredTags
                                            );
                                        }}
                                    >
                                        View all tags created by you
                                    </h3>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1 className="profile">All questions posted you</h1>
                    {filteredQuestions.length === 0 ? (
                        <h3 className="profile">
                            You haven't posted any questions
                        </h3>
                    ) : (
                        <QuestionsPage
                            data={this.props.data}
                            orderedQuestions={filteredQuestions}
                            onclick={this.props.onclick}
                            title={"Questions asked by you"}
                            onlinkclick={this.props.onlinkclick}
                            userType={this.props.userType}
                            profile={true}
                            onEdit={this.props.onEdit}
                            onDelete={this.props.onDelete}
                        />
                    )}
                </React.Fragment>
            );
        }
    }
}

export default ProfilePage;
