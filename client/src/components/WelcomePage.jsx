import React from "react";

class WelcomePage extends React.Component {
    render() {
        return (
            <div className="page" id="welcome-page">
                <h1>Welcome to Fake StackOverflow</h1>
                <button
                    className="button"
                    onClick={() => {
                        this.props.onclick("register");
                    }}
                >
                    Register a new account
                </button>
                <br></br>
                <button
                    className="button"
                    onClick={() => {
                        this.props.onclick("login");
                    }}
                >
                    Log into an existing account
                </button>
                <br></br>
                <button
                    className="button gray-button"
                    onClick={() => {
                        this.props.onclick("guest");
                    }}
                >
                    Continue as guest
                </button>
                <br></br>
            </div>
        );
    }
}

export default WelcomePage;
