import React from "react";
import Answer from "./Answer";
class ProfileAnswers extends React.Component {
    getOn = (date) => {
        let ansDate = new Date(date);
        let ansMonth = ansDate.getMonth();
        return `${this.getMonthNumber(
            ansMonth
        )} ${ansDate.getDate()}, ${ansDate.getFullYear()}`;
    };

    getAt = (date) => {
        let ansDate = new Date(date);

        let time = "";
        let hour = ansDate.getHours();
        let minute = ansDate.getMinutes();

        if (minute < 10 && hour < 10) {
            time = `0${hour}:0${minute}`;
        } else if (minute < 10 && hour >= 10) {
            time = `${hour}:0${minute}`;
        } else if (minute >= 10 && hour < 10) {
            time = `0${hour}:${minute}`;
        } else {
            time = hour + ":" + minute;
        }

        return time;
    };

    getMonthNumber = (num) => {
        switch (num) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "Mar";
            case 3:
                return "Apr";
            case 4:
                return "May";
            case 5:
                return "Jun";
            case 6:
                return "Jul";
            case 7:
                return "Aug";
            case 8:
                return "Sep";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec";
            default:
                return null;
        }
    };

    render() {
        if (this.props.filteredAnswers.length !== 0) {
            return (
                <React.Fragment>
                    <h1 className="profile">Answers Posted By You</h1>
                    <table id="profile-table">
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}></th>
                                <th style={{ width: "60%" }}></th>
                                <th style={{ width: "20%" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.filteredAnswers.map((answer) => {
                                return (
                                    <React.Fragment key={answer._id}>
                                        <tr
                                            style={{
                                                borderBottom: "1px solid #000",
                                                marginTop: "100px",
                                            }}
                                        >
                                            <td>
                                                <button
                                                    className="profile-button"
                                                    onClick={() =>
                                                        this.props.onEdit(
                                                            answer._id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="profile-button-red"
                                                    onClick={() =>
                                                        this.props.onDelete(
                                                            answer._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            <Answer
                                                answer={answer}
                                                getOn={this.getOn}
                                                getAt={this.getAt}
                                            />
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </React.Fragment>
            );
        } else {
            return <h1 className="profile">You haven't posted any answers</h1>;
        }
    }
}

export default ProfileAnswers;
