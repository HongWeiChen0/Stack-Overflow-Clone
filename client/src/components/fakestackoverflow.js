import React from "react";
import AnswersPage from "./AnswersPage.jsx";
import Banner from "./Banner";
import NewAnswerPage from "./NewAnswerPage.jsx";
import NewQuestionPage from "./NewQuestionPage.jsx";
import QuestionsPage from "./QuestionsPage.jsx";
import SearchResultPage from "./SearchResultPage.jsx";
import TagsPage from "./TagsPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import LoginPage from "./LoginPage";
import WelcomePage from "./WelcomePage.jsx";
import axios from "axios";
import ProfilePage from "./ProfilePage.jsx";
import ProfileAnswers from "./ProfileAnswers.jsx";
import ProfileTags from "./ProfileTags.jsx";
import EditTagPage from "./EditTagPage.jsx";

export default class FakeStackOverflow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            currentPage: "WelcomePage",
            filteredQuestions: [],
            searchType: "",
            currentQuestion: "",
            loaded: false,

            token: "",
            userType: "",
            user: {},

            filteredAnswers: [],
            filteredTags: [],

            editingQuestion: "",
            editingAnswer: "",
            editingTag: "",
        };
    }

    async componentDidMount() {
        this.setState({ loaded: false });

        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            this.setState({ token: user.token });
            this.setState({ userType: "user" });
            this.setState({ currentPage: "QuestionsPage" });
            this.setState({ user: user });
        }

        let newData = { questions: [], answers: [], tags: [] };

        const questionsRes = await axios.get(
            "http://localhost:8000/posts/question"
        );
        newData.questions = questionsRes.data;

        const answersRes = await axios.get(
            "http://localhost:8000/posts/answer"
        );
        newData.answers = answersRes.data;

        const tagsRes = await axios.get("http://localhost:8000/posts/tag");
        newData.tags = tagsRes.data;

        this.setState({ data: newData, loaded: true });
    }

    handleAskQuestion = () => {
        this.setState({ currentPage: "NewQuestionPage" });
    };

    handleQuestionsPage = () => {
        this.setState({ currentPage: "QuestionsPage" });
    };

    handleSubmitQuestion = async (
        title,
        question,
        summary,
        tags,
        username,
        authorId
    ) => {
        let newQuestion = {};
        newQuestion.title = title;
        newQuestion.text = question;
        newQuestion.summary = summary;
        newQuestion.tags = await this.handleTagIds(tags);
        if (username.length !== 0) {
            newQuestion.asked_by = username;
        }
        newQuestion.views = 0;
        newQuestion.asked_by_Id = authorId;

        await axios.post("http://localhost:8000/posts/question", newQuestion);

        this.setState({ currentPage: "QuestionsPage" });
        this.componentDidMount();
    };

    handleNewAnswer = () => {
        this.setState({ currentPage: "NewAnswerPage" });
    };

    handleSubmitAnswer = async (answer) => {
        let newAnswer = {};
        newAnswer.text = answer;
        newAnswer.ans_by = this.state.user.name;
        newAnswer.ans_by_Id = this.state.user._id;

        let answerRes = await axios.post(
            "http://localhost:8000/posts/answer",
            newAnswer
        );

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i]._id === this.state.currentQuestion) {
                targetQuestion = questions[i];
                break;
            }
        }

        targetQuestion.answers.unshift(answerRes.data);
        await axios.put(
            `http://localhost:8000/posts/question/${this.state.currentQuestion}`,
            { answers: targetQuestion.answers }
        );

        this.componentDidMount();
        this.setState({ currentPage: "AnswersPage" });
    };

    handleComment = async (commentText, type, targetid) => {
        let newComment = {};
        newComment.text = commentText;
        newComment.username = this.state.user.name;
        let commentRes = await axios.post(
            "http://localhost:8000/posts/comment",
            newComment
        );
        if (type === "question") {
            let questions = this.state.data.questions;
            let targetQuestion;
            for (let i = 0; i < questions.length; i++) {
                if (questions[i]._id === this.state.currentQuestion) {
                    targetQuestion = questions[i];
                    break;
                }
            }
            targetQuestion.comments.unshift(commentRes.data);
            await axios.put(
                `http://localhost:8000/posts/question/${this.state.currentQuestion}`,
                { comments: targetQuestion.comments }
            );
        }
        if (type === "answer") {
            let questions = this.state.data.questions;
            let targetQuestion;
            for (let i = 0; i < questions.length; i++) {
                if (questions[i]._id === this.state.currentQuestion) {
                    targetQuestion = questions[i];
                    break;
                }
            }
            let answers = targetQuestion.answers;
            let targetAnswer;
            for (let i = 0; i < answers.length; i++) {
                if (answers[i]._id === targetid) {
                    answers[i].comments.unshift(commentRes.data);
                    targetAnswer = answers[i];
                    break;
                }
            }
            await axios.put(
                `http://localhost:8000/posts/question/${this.state.currentQuestion}`,
                { answers }
            );
            await axios.put(`http://localhost:8000/posts/answer/${targetid}`, {
                comments: targetAnswer.comments,
            });
        }

        this.componentDidMount();
        this.setState({ currentPage: "AnswersPage" });
    };

    handleTagIds = async (tags) => {
        let result = [];
        tags = tags.trim();
        let tagEntered = tags.split(/[ ]+/);
        for (let i = 0; i < tagEntered.length; i++) {
            let existing = false;
            if (
                result.find((element) => element.name === tagEntered[i]) !==
                undefined
            ) {
                continue;
            }
            for (let j = 0; j < this.state.data.tags.length; j++) {
                if (
                    this.state.data.tags[j].name.toLowerCase() ===
                    tagEntered[i].toLowerCase()
                ) {
                    existing = true;
                    if (
                        result.find(
                            (element) =>
                                element.name === this.state.data.tags[j].name
                        ) === undefined
                    ) {
                        result.push(this.state.data.tags[j]);
                    }
                    break;
                }
            }
            if (!existing) {
                let newTag = {
                    name: tagEntered[i].toLowerCase(),
                    created_by_Id: this.state.user._id,
                };
                const tagRes = await axios.post(
                    "http://localhost:8000/posts/tag",
                    newTag
                );
                result.push(tagRes.data);
            }
        }
        return result;
    };

    handleSearch = (searchStr, searchType) => {
        this.componentDidMount();
        if (searchType === "search") {
            this.setState({ searchType: "Search Results" });
        } else if (searchType === "tag-search") {
            this.setState({ searchType: `Questions tagged ${searchStr}` });
        }

        const questions = this.state.data.questions;
        let tags = searchStr.match(/\[\w+-*\w*\]/g);
        if (tags != null) {
            for (let i = 0; i < tags.length; i++) {
                tags[i] = tags[i].substring(1, tags[i].length - 1);
            }
            searchStr = searchStr.replace(/\[\w+-*\w*\]/g, "");
        }
        let keywords = searchStr.match(/\w+/g);
        let filtered = [];
        if (keywords != null) {
            for (let i = 0; i < questions.length; i++) {
                for (let j = 0; j < keywords.length; j++) {
                    if (
                        (questions[i].title
                            .toLowerCase()
                            .includes(keywords[j].toLowerCase()) ||
                            questions[i].text
                                .toLowerCase()
                                .includes(keywords[j].toLowerCase()) ||
                            questions[i].summary
                                .toLowerCase()
                                .includes(keywords[j].toLowerCase())) &&
                        !filtered.includes(questions[i])
                    ) {
                        filtered.push(questions[i]);
                    }
                }
            }
        }
        if (tags != null) {
            for (let i = 0; i < questions.length; i++) {
                let loopTags = questions[i].tags;
                loopTags = loopTags.map((element) =>
                    element.name.toLowerCase()
                );
                for (let j = 0; j < tags.length; j++) {
                    if (
                        loopTags.includes(tags[j].toLowerCase()) &&
                        !filtered.includes(questions[i])
                    ) {
                        filtered.push(questions[i]);
                    }
                }
            }
        }
        this.setState({ filteredQuestions: filtered });
        this.setState({ currentPage: "SearchResultPage" });
    };

    handleLinkClick = async (qid) => {
        for (let i = 0; i < this.state.data.questions.length; i++) {
            if (this.state.data.questions[i]._id === qid) {
                let views = this.state.data.questions[i].views;

                await axios.put(`http://localhost:8000/posts/question/${qid}`, {
                    views: views + 1,
                });
                this.componentDidMount();
            }
        }
        this.setState({ currentQuestion: qid });
        this.setState({ currentPage: "AnswersPage" });
    };

    handleTagsPage = () => {
        this.setState({ currentPage: "TagsPage" });
    };

    handleTagClick = (name) => {
        let searchStr = `[${name}]`;
        this.handleSearch(searchStr, "tag-search");
    };

    handleRegisterNewUser = async (name, email, password) => {
        let user = {};
        user.name = name;
        user.email = email;
        user.password = password;

        await axios.post("http://localhost:8000/posts/user", user);

        this.setState({ currentPage: "LoginPage" });
    };

    handleLogin = (userRes) => {
        let token = userRes.data.token;
        this.setState({ token });
        this.setState({ userType: "user" });
        if (userRes.data) {
            localStorage.setItem("user", JSON.stringify(userRes.data));
        }
        this.setState({ currentPage: "QuestionsPage" });
        this.componentDidMount();
    };

    handleWelcome = (clicked) => {
        if (clicked === "register") {
            this.setState({ currentPage: "RegisterPage" });
        } else if (clicked === "login") {
            this.setState({ currentPage: "LoginPage" });
        } else if (clicked === "guest") {
            this.setState({ userType: "guest" });
            this.setState({ currentPage: "QuestionsPage" });
        }
    };

    handleLogOff = () => {
        localStorage.clear();
        this.setState({ userType: "" });
        this.setState({ token: "" });
        this.setState({ currentPage: "WelcomePage" });
        this.setState({ user: {} });
    };

    handleVote = async (type, aid) => {
        let currentQuestion;
        let currentAnswer;
        if (aid === undefined) {
            for (let i = 0; i < this.state.data.questions.length; i++) {
                if (
                    this.state.data.questions[i]._id ===
                    this.state.currentQuestion
                ) {
                    currentQuestion = this.state.data.questions[i];
                }
            }
        } else {
            for (let i = 0; i < this.state.data.answers.length; i++) {
                if (this.state.data.answers[i]._id === aid) {
                    currentAnswer = this.state.data.answers[i];
                }
            }
        }

        let currentVote;
        if (aid === undefined) {
            currentVote = currentQuestion.votes;
        } else {
            currentVote = currentAnswer.votes;
        }

        let currentUpvoted = await axios.get(
            `http://localhost:8000/posts/user/upvoted/${this.state.user._id}`
        );
        currentUpvoted = currentUpvoted.data;
        let currentDownvoted = await axios.get(
            `http://localhost:8000/posts/user/downvoted/${this.state.user._id}`
        );
        currentDownvoted = currentDownvoted.data;

        let user;
        if (aid === undefined) {
            user = await axios.get(
                `http://localhost:8000/posts/user/rep/${this.state.currentQuestion}`
            );
        } else {
            user = await axios.get(
                `http://localhost:8000/posts/user/rep/byanswer/${currentAnswer._id}`
            );
        }
        let currentRep = user.data.rep;
        if (type === "up") {
            if (aid === undefined) {
                currentVote++;
                currentUpvoted.push(this.state.currentQuestion);

                let updatedDownvoted = currentDownvoted.filter((e) => {
                    return e !== this.state.currentQuestion;
                });

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { downvoted: updatedDownvoted }
                );

                let updatedRep = currentRep + 5;
                if (currentDownvoted.includes(this.state.currentQuestion)) {
                    currentVote++;
                    updatedRep += 10;
                }

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { upvoted: currentUpvoted }
                );
                await axios.put(
                    `http://localhost:8000/posts/user/rep/${user.data.user._id}`,
                    { reputation: updatedRep }
                );
                let newUser = await axios.get(
                    `http://localhost:8000/posts/user/byId/${this.state.user._id}`
                );
                localStorage.setItem("user", JSON.stringify(newUser.data));
            } else {
                currentVote++;
                currentUpvoted.push(currentAnswer._id);

                let updatedDownvoted = currentDownvoted.filter((e) => {
                    return e !== currentAnswer._id;
                });

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { downvoted: updatedDownvoted }
                );

                let updatedRep = currentRep + 5;
                if (currentDownvoted.includes(currentAnswer._id)) {
                    currentVote++;
                    updatedRep += 10;
                }

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { upvoted: currentUpvoted }
                );
                await axios.put(
                    `http://localhost:8000/posts/user/rep/${user.data.user._id}`,
                    { reputation: updatedRep }
                );
                let newUser = await axios.get(
                    `http://localhost:8000/posts/user/byId/${this.state.user._id}`
                );
                localStorage.setItem("user", JSON.stringify(newUser.data));
            }
        } else {
            if (aid === undefined) {
                currentVote--;
                currentDownvoted.push(this.state.currentQuestion);

                let updatedUpvoted = currentUpvoted.filter((e) => {
                    return e !== this.state.currentQuestion;
                });

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { upvoted: updatedUpvoted }
                );

                let updatedRep = currentRep - 10;
                if (currentUpvoted.includes(this.state.currentQuestion)) {
                    currentVote--;
                    updatedRep -= 5;
                }

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { downvoted: currentDownvoted }
                );
                await axios.put(
                    `http://localhost:8000/posts/user/rep/${user.data.user._id}`,
                    { reputation: updatedRep }
                );
                let newUser = await axios.get(
                    `http://localhost:8000/posts/user/byId/${this.state.user._id}`
                );

                localStorage.setItem("user", JSON.stringify(newUser.data));
            } else {
                currentVote--;
                currentDownvoted.push(currentAnswer._id);

                let updatedUpvoted = currentUpvoted.filter((e) => {
                    return e !== currentAnswer._id;
                });

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { upvoted: updatedUpvoted }
                );

                let updatedRep = currentRep - 10;
                if (currentUpvoted.includes(currentAnswer._id)) {
                    currentVote--;
                    updatedRep -= 5;
                }

                await axios.put(
                    `http://localhost:8000/posts/user/${this.state.user._id}`,
                    { downvoted: currentDownvoted }
                );
                await axios.put(
                    `http://localhost:8000/posts/user/rep/${user.data.user._id}`,
                    { reputation: updatedRep }
                );
                let newUser = await axios.get(
                    `http://localhost:8000/posts/user/byId/${this.state.user._id}`
                );

                localStorage.setItem("user", JSON.stringify(newUser.data));
            }
        }

        if (aid === undefined) {
            await axios.put(
                `http://localhost:8000/posts/question/${currentQuestion._id}`,
                { votes: currentVote }
            );
        } else {
            await axios.put(
                `http://localhost:8000/posts/answer/${currentAnswer._id}`,
                { votes: currentVote }
            );
            let currentQuestionAnswers = await axios.get(
                `http://localhost:8000/posts/question/answers/${this.state.currentQuestion}`
            );
            currentQuestionAnswers = currentQuestionAnswers.data;
            for (let i = 0; i < currentQuestionAnswers.length; i++) {
                if (currentQuestionAnswers[i]._id === currentAnswer._id) {
                    currentQuestionAnswers[i].votes = currentVote;
                }
            }
            await axios.put(
                `http://localhost:8000/posts/question/${this.state.currentQuestion}`,
                { answers: currentQuestionAnswers }
            );
        }

        this.componentDidMount();
        if (aid === undefined) {
            this.setState({ currentQuestion: currentQuestion._id });
        }
        this.setState({ currentPage: "AnswersPage" });
    };

    handleProfileClick = () => {
        this.setState({ currentPage: "ProfilePage" });
    };

    handleProfileAnswers = (filteredAnswers) => {
        this.setState({ currentPage: "ProfileAnswers" });
        this.setState({ filteredAnswers });
    };

    handleProfileTags = (filteredTags) => {
        this.setState({ currentPage: "ProfileTags" });
        this.setState({ filteredTags });
    };

    handleQuestionEdit = (qid) => {
        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i]._id === qid) {
                targetQuestion = questions[i];
                break;
            }
        }
        this.setState({ editingQuestion: targetQuestion });
        this.setState({ currentPage: "EditQuestionPage" });
    };

    handleAnswerEdit = (aid) => {
        let answers = this.state.data.answers;
        let targetAnswer;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i]._id === aid) {
                targetAnswer = answers[i];
                break;
            }
        }
        this.setState({ editingAnswer: targetAnswer });
        this.setState({ currentPage: "EditAnswerPage" });
    };

    handleTagEdit = (tagname) => {
        let tags = this.state.data.tags;
        let targetTag;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].name === tagname) {
                targetTag = tags[i];
                break;
            }
        }
        this.setState({ editingTag: targetTag });
        this.setState({ currentPage: "EditTagPage" });
    };

    handleQuestionEditSubmit = async (
        title,
        question,
        summary,
        tags,
        username,
        authorId
    ) => {
        let newQuestion = {};
        newQuestion.title = title;
        newQuestion.text = question;
        newQuestion.summary = summary;
        newQuestion.tags = await this.handleTagIds(tags);
        if (username.length !== 0) {
            newQuestion.asked_by = username;
        }
        newQuestion.asked_by_Id = authorId;

        await axios.put(
            `http://localhost:8000/posts/question/${this.state.editingQuestion._id}`,
            newQuestion
        );

        this.setState({ currentPage: "ProfilePage" });
        this.componentDidMount();
    };

    handleAnswerEditSubmit = async (answer) => {
        let newAnswer = {};
        newAnswer.text = answer;
        newAnswer.ans_by = this.state.user.name;
        newAnswer.ans_by_Id = this.state.user._id;

        await axios.put(
            `http://localhost:8000/posts/answer/${this.state.editingAnswer._id}`,
            newAnswer
        );

        let updatedAnswer = await axios.get(
            `http://localhost:8000/posts/answer/byId/${this.state.editingAnswer._id}`
        );
        updatedAnswer = updatedAnswer.data;

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            let answers = questions[i].answers;
            for (let j = 0; j < answers.length; j++) {
                if (answers[j]._id === this.state.editingAnswer._id) {
                    questions[i].answers[j] = updatedAnswer;
                    targetQuestion = questions[i];
                    break;
                }
            }
        }

        await axios.put(
            `http://localhost:8000/posts/question/${targetQuestion._id}`,
            { answers: targetQuestion.answers }
        );

        this.componentDidMount();
        this.setState({ currentPage: "ProfilePage" });
    };

    handleTagEditSubmit = async (tagtext) => {
        let newTag = {};
        newTag.name = tagtext;

        await axios.put(
            `http://localhost:8000/posts/tag/edit/${this.state.editingTag.name}`,
            newTag
        );

        let updatedTag = await axios.get(
            `http://localhost:8000/posts/tag/find/${tagtext}`
        );
        updatedTag = updatedTag.data;

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            let tags = questions[i].tags;
            for (let j = 0; j < tags.length; j++) {
                if (tags[j]._id === this.state.editingTag._id) {
                    questions[i].tags[j] = updatedTag;
                    targetQuestion = questions[i];
                    await axios.put(
                        `http://localhost:8000/posts/question/${targetQuestion._id}`,
                        { tags: targetQuestion.tags }
                    );
                    break;
                }
            }
        }

        this.componentDidMount();
        this.setState({ currentPage: "ProfilePage" });
    };

    handleQuestionDelete = async (qid) => {
        let aids = [];

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i]._id === qid) {
                targetQuestion = questions[i];
            }
        }
        let answers = targetQuestion.answers;
        for (let i = 0; i < answers.length; i++) {
            aids.push(answers[i]._id);
        }
        for (let i = 0; i < aids.length; i++) {
            await this.handleAnswerDelete(aids[i]);
        }

        await axios.delete(`http://localhost:8000/posts/question/${qid}`);
        this.componentDidMount();
        this.setState({ currentPage: "ProfilePage" });
    };

    handleAnswerDelete = async (aid) => {
        await axios.delete(`http://localhost:8000/posts/answer/${aid}`);

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            let answers = questions[i].answers;
            for (let j = 0; j < answers.length; j++) {
                if (answers[j]._id === aid) {
                    questions[i].answers.splice(j, 1);
                    targetQuestion = questions[i];
                    break;
                }
            }
        }

        await axios.put(
            `http://localhost:8000/posts/question/${targetQuestion._id}`,
            { answers: targetQuestion.answers }
        );

        this.componentDidMount();
        this.setState({ currentPage: "ProfilePage" });
    };

    handleTagDelete = async (tagtext) => {
        let tags = this.state.data.tags;
        let targetTag;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].name === tagtext) {
                targetTag = tags[i];
                break;
            }
        }
        this.setState({ editingTag: targetTag });

        await axios.delete(`http://localhost:8000/posts/tag/${tagtext}`);

        let questions = this.state.data.questions;
        let targetQuestion;
        for (let i = 0; i < questions.length; i++) {
            let tags = questions[i].tags;
            for (let j = 0; j < tags.length; j++) {
                if (tags[j]._id === this.state.editingTag._id) {
                    questions[i].tags.splice(j, 1);
                    targetQuestion = questions[i];
                    await axios.put(
                        `http://localhost:8000/posts/question/${targetQuestion._id}`,
                        { tags: targetQuestion.tags }
                    );
                    break;
                }
            }
        }

        this.componentDidMount();
        this.setState({ currentPage: "ProfilePage" });
    };

    render() {
        if (this.state.loaded) {
            let currentPage;
            if (this.state.currentPage === "QuestionsPage") {
                currentPage = (
                    <QuestionsPage
                        data={this.state.data}
                        orderedQuestions={this.state.data.questions}
                        onclick={this.handleAskQuestion}
                        title={"All Questions"}
                        onlinkclick={this.handleLinkClick}
                        userType={this.state.userType}
                    />
                );
            } else if (this.state.currentPage === "NewQuestionPage") {
                currentPage = (
                    <NewQuestionPage
                        onclick={this.handleSubmitQuestion}
                        user={this.state.user}
                    />
                );
            } else if (this.state.currentPage === "SearchResultPage") {
                currentPage = (
                    <SearchResultPage
                        orderedQuestions={
                            this.state.filteredQuestions.length === 0
                                ? null
                                : this.state.filteredQuestions
                        }
                        title={this.state.searchType}
                        data={this.state.data}
                        onclick={this.handleAskQuestion}
                        onlinkclick={this.handleLinkClick}
                        userType={this.state.userType}
                    />
                );
            } else if (this.state.currentPage === "AnswersPage") {
                currentPage = (
                    <AnswersPage
                        data={this.state.data}
                        question={this.state.currentQuestion}
                        onclick={this.handleAskQuestion}
                        onanswerclick={this.handleNewAnswer}
                        onvote={this.handleVote}
                        userType={this.state.userType}
                        user={this.state.user}
                        onkeydown={this.handleComment}
                    />
                );
            } else if (this.state.currentPage === "NewAnswerPage") {
                currentPage = (
                    <NewAnswerPage onclick={this.handleSubmitAnswer} />
                );
            } else if (this.state.currentPage === "TagsPage") {
                currentPage = (
                    <TagsPage
                        data={this.state.data}
                        onclick={this.handleAskQuestion}
                        ontagclick={this.handleTagClick}
                        userType={this.state.userType}
                    />
                );
            } else if (this.state.currentPage === "RegisterPage") {
                currentPage = (
                    <RegisterPage onclick={this.handleRegisterNewUser} />
                );
            } else if (this.state.currentPage === "LoginPage") {
                currentPage = <LoginPage onclick={this.handleLogin} />;
            } else if (this.state.currentPage === "WelcomePage") {
                currentPage = <WelcomePage onclick={this.handleWelcome} />;
            } else if (this.state.currentPage === "ProfilePage") {
                currentPage = (
                    <ProfilePage
                        data={this.state.data}
                        orderedQuestions={this.state.data.questions}
                        onclick={this.handleAskQuestion}
                        title={"All Questions"}
                        onlinkclick={this.handleLinkClick}
                        userType={this.state.userType}
                        user={this.state.user}
                        profileAnswersClick={this.handleProfileAnswers}
                        profileTagsClick={this.handleProfileTags}
                        onEdit={this.handleQuestionEdit}
                        onDelete={this.handleQuestionDelete}
                    />
                );
            } else if (this.state.currentPage === "ProfileAnswers") {
                currentPage = (
                    <ProfileAnswers
                        filteredAnswers={this.state.filteredAnswers}
                        onEdit={this.handleAnswerEdit}
                        onDelete={this.handleAnswerDelete}
                    />
                );
            } else if (this.state.currentPage === "ProfileTags") {
                currentPage = (
                    <ProfileTags
                        onclick={this.handleAskQuestion}
                        filteredTags={this.state.filteredTags}
                        userType={this.state.userType}
                        data={this.state.data}
                        onEdit={this.handleTagEdit}
                        onDelete={this.handleTagDelete}
                    />
                );
            } else if (this.state.currentPage === "EditQuestionPage") {
                currentPage = (
                    <NewQuestionPage
                        onclick={this.handleQuestionEditSubmit}
                        user={this.state.user}
                    />
                );
            } else if (this.state.currentPage === "EditAnswerPage") {
                currentPage = (
                    <NewAnswerPage onclick={this.handleAnswerEditSubmit} />
                );
            } else if (this.state.currentPage === "EditTagPage") {
                currentPage = (
                    <EditTagPage onclick={this.handleTagEditSubmit} />
                );
            }

            if (this.state.currentPage === "WelcomePage") {
                return (
                    <React.Fragment>
                        <div>{currentPage}</div>
                    </React.Fragment>
                );
            }

            if (this.state.currentPage === "RegisterPage") {
                return (
                    <React.Fragment>
                        <div>{currentPage}</div>
                    </React.Fragment>
                );
            }
            if (this.state.currentPage === "LoginPage") {
                return (
                    <React.Fragment>
                        <div>{currentPage}</div>
                    </React.Fragment>
                );
            }
            return (
                <React.Fragment>
                    <Banner
                        highlight={this.state.currentPage}
                        onkeydown={this.handleSearch}
                        onquestionclick={this.handleQuestionsPage}
                        ontagsclick={this.handleTagsPage}
                        onLogOff={this.handleLogOff}
                        user={this.state.user}
                        userType={this.state.userType}
                        profileclick={this.handleProfileClick}
                    />
                    <div className="main" id="main">
                        {currentPage}
                    </div>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }
}
