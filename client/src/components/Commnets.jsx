import React from "react";
class Comments extends React.Component {
    render() {
        return (
            <React.Fragment>
                <p
                    style={{
                        borderTop: "1px solid #000",
                        borderBottom: "1px solid #000",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                    }}
                >
                    <b>{this.props.comment.username}:</b>{" "}
                    {this.props.comment.text}
                </p>
            </React.Fragment>
        );
    }
}

export default Comments;
