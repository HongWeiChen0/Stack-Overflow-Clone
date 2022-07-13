import React from "react";
import axios from "axios";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            nameInvalid: false,
            emailInvalid: false,
            passwordEmpty: false,
            passwordDontMatch: false,
            passwordContainNameOrEmail: false,
            emailUsed: false,
        };
    }

    handleChange = (event, targetField) => {
        this.setState({ [targetField]: event.target.value });
    };

    checkEmpty = async () => {
        let error = false;
        if (this.state.name.trim().length === 0) {
            this.setState({ nameInvalid: true });
            error = true;
        } else {
            this.setState({ nameInvalid: false });
        }
        let email = this.state.email.match(
            // eslint-disable-next-line
            /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/
        );
        if (!email) {
            this.setState({ emailInvalid: true });
            error = true;
        } else {
            this.setState({ emailInvalid: false });
        }

        if (this.state.password.length === 0) {
            this.setState({ passwordEmpty: true });
            error = true;
        } else {
            this.setState({ passwordEmpty: false });
        }

        if (this.state.password !== this.state.password2) {
            this.setState({ passwordDontMatch: true });
            error = true;
        } else {
            this.setState({ passwordDontMatch: false });
        }

        let atLocation = this.state.email.indexOf("@");
        let emailId = this.state.email.substring(0, atLocation);
        if (
            this.state.password.includes(emailId) ||
            this.state.password.includes(this.state.name)
        ) {
            this.setState({ passwordContainNameOrEmail: true });
            error = true;
        } else {
            this.setState({ passwordContainNameOrEmail: false });
        }

        let findEmail = await axios.get(
            "http://localhost:8000/posts/user/email",
            { email: this.state.email }
        );
        if (findEmail.data.message === "email found") {
            this.setState({ emailUsed: true });
            error = true;
        } else {
            this.setState({ emailUsed: false });
        }

        if (!error) {
            this.props.onclick(
                this.state.name,
                this.state.email,
                this.state.password
            );
        }
    };

    render() {
        let errorMessage = "";
        if (this.state.nameInvalid) {
            errorMessage += "Username invalid\n";
        }
        if (this.state.emailInvalid) {
            errorMessage += "Email invalid\n";
        }
        if (this.state.passwordEmpty) {
            errorMessage += "Password can not be empty\n";
        }
        if (this.state.passwordDontMatch) {
            errorMessage += "Make sure the passwords match\n";
        }
        if (this.state.passwordContainNameOrEmail) {
            errorMessage += "Password can not contain name or email\n";
        }
        if (this.state.emailUsed) {
            errorMessage +=
                "There's already an account registered with this email\n";
        }
        return (
            <div className="page" id="register-page">
                <div id="new-question-error">
                    {errorMessage.split("\n").map((str) => (
                        <p key={str}>{str}</p>
                    ))}
                </div>
                <h1>Register for an account</h1>
                <h3>Name:</h3>
                <input
                    type="text"
                    value={this.state.name}
                    onChange={(e) => {
                        this.handleChange(e, "name");
                    }}
                />
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
                <h3>Confirm password:</h3>
                <input
                    type="password"
                    value={this.state.password2}
                    onChange={(e) => {
                        this.handleChange(e, "password2");
                    }}
                />
                <br></br>
                <button id="register-button" onClick={this.checkEmpty}>
                    Register Account
                </button>
            </div>
        );
    }
}

export default RegisterPage;
