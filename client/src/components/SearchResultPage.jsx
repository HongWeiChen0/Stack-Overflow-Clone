import React from "react";
import QuestionsPage from "./QuestionsPage";
class SearchResultPage extends React.Component {
    render() {
        if (this.props.orderedQuestions === null) {
            return (
                <React.Fragment>
                    <h1
                        id="no-result"
                        style={{ textAlign: "center", color: "red" }}
                    >
                        No Results Found
                    </h1>
                    <QuestionsPage
                        data={this.props.data}
                        orderedQuestions={[]}
                        onclick={this.props.onclick}
                        title={this.props.title}
                        onlinkclick={this.props.onlinkclick}
                    />
                </React.Fragment>
            );
        }
        return (
            <QuestionsPage
                data={this.props.data}
                orderedQuestions={this.props.orderedQuestions}
                onclick={this.props.onclick}
                title={this.props.title}
                onlinkclick={this.props.onlinkclick}
                userType={this.props.userType}
            />
        );
    }
}

export default SearchResultPage;
