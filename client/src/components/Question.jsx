import React from "react";

class Question extends React.Component {
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

    render() {
        const question = this.props.question;
        let counter = 0;
        let date = new Date(question.ask_date_time);
        return (
            <React.Fragment>
                <tr style={{ borderBottom: "1px solid #000" }}>
                    <td>
                        <span className="col1">{question.views} Views</span>{" "}
                        <span className="col1">
                            {question.answers.length} Answers
                        </span>
                        <span className="col1">{question.votes} Votes</span>
                    </td>
                    <td>
                        <span
                            className="question-title"
                            id={question._id}
                            onClick={() => {
                                this.props.onlinkclick(this.props.question._id);
                            }}
                        >
                            {question.title}
                        </span>
                        <span className="question-summary">
                            {question.summary}
                        </span>
                        {question.tags.map((tag) => {
                            if (counter === 3) {
                                counter = 0;
                                return (
                                    <React.Fragment key={tag._id}>
                                        <span className="tags" key={tag._id}>
                                            {tag.name}
                                        </span>
                                        <br></br>
                                    </React.Fragment>
                                );
                            } else {
                                counter++;
                                return (
                                    <span className="tags" key={tag._id}>
                                        {tag.name}
                                    </span>
                                );
                            }
                        })}
                    </td>
                    <td>
                        <span className="col3">
                            Asked By {question.asked_by}
                        </span>
                        <span className="col3">On {this.getOn(date)}</span>
                        <span className="col3">At {this.getAt(date)}</span>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

export default Question;
