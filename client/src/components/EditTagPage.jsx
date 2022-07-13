import React from "react";
class EditTagPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: "",
            tagEmpty: false,
            tagContainSpace: false,
        };
    }

    checkEmpty = () => {
        let error = false;
        if (this.state.tag.trim().length === 0) {
            this.setState({ tagEmpty: true });
            error = true;
        } else {
            this.setState({ tagEmpty: false });
        }
        if (this.state.tag.trim().includes(" ")) {
            this.setState({ tagContainSpace: true });
            error = true;
        }

        if (!error) {
            this.props.onclick(this.state.tag.trim());
        }
    };

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    render() {
        let errorMessage = "";
        if (this.state.tagEmpty) {
            errorMessage += "Tag name can't be empty!\n";
        }
        if (this.state.tagContainSpace) {
            errorMessage += "Tag can't include spaces!\n";
        }

        return (
            <React.Fragment>
                <div id="post-new-answer" className="page">
                    <div id="new-ans-error">
                        {errorMessage.split("\n").map((str) => (
                            <p key={str}>{str}</p>
                        ))}
                    </div>

                    <h2>Tag name</h2>
                    <textarea
                        type="text"
                        className="answer-textarea"
                        id="answer-textarea"
                        value={this.state.tag}
                        onChange={(e) => {
                            this.handleChange(e, "tag");
                        }}
                    ></textarea>

                    <button id="post-answer-button" onClick={this.checkEmpty}>
                        Post tag
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default EditTagPage;
