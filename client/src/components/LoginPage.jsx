import React from "react";
import axios from "axios";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            invalidLogin: false,
        };
    }

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    checkLogin = async () => {
        let loginRes = await axios.post(
            "http://localhost:8000/posts/user/login",
            { email: this.state.email, password: this.state.password }
        );
        if (loginRes.data.errMessage) {
            this.setState({ invalidLogin: true });
        } else {
            this.setState({ invalidLogin: false });
            this.props.onclick(loginRes);
        }
    };

    render() {
        let errorMessage = "";
        if (this.state.invalidLogin) {
            errorMessage += "Invalid credentials, please try again.\n";
        }
        return (
            <div className="page" id="login-page">
                <div id="new-question-error">
                    {errorMessage.split("\n").map((str) => (
                        <p key={str}>{str}</p>
                    ))}
                </div>
                <h1>Login</h1>
                <h3>Email:</h3>
                <input
                    type="text"
                    value={this.state.email}
                    onChange={(e) => {
                        this.handleChange(e, "email");
                    }}
                />
                <h3>Password:</h3>
                <input
                    type="password"
                    value={this.state.password}
                    onChange={(e) => {
                        this.handleChange(e, "password");
                    }}
                />
                <br></br>
                <button id="login-button" onClick={this.checkLogin}>
                    Log in
                </button>
            </div>
        );
    }
}

export default LoginPage;
