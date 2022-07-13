import React, { useState } from "react";
function Banner(props) {
    const [searchStr, setSearchStr] = useState("");
    return (
        <div id="banner" className="banner">
            <ul className="nav">
                <li
                    className={
                        props.highlight === "QuestionsPage"
                            ? "link"
                            : "link nonHighlight"
                    }
                    id="nav-questions"
                    style={{
                        backgroundColor:
                            props.highlight === "QuestionsPage"
                                ? "#0281e8"
                                : "#f8f9f9",
                    }}
                    onClick={props.onquestionclick}
                >
                    Questions
                </li>
                <li
                    className={
                        props.highlight === "TagsPage"
                            ? "link"
                            : "link nonHighlight"
                    }
                    id="nav-tags"
                    style={{
                        backgroundColor:
                            props.highlight === "TagsPage"
                                ? "#0281e8"
                                : "#f8f9f9",
                    }}
                    onClick={props.ontagsclick}
                >
                    Tags
                </li>
                <li id="banner-title">Fake Stack Overflow</li>
                <li>
                    <input
                        id="search-bar"
                        type="text"
                        placeholder="Search..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                props.onkeydown(searchStr, "search");
                            }
                        }}
                        value={searchStr}
                        onChange={(e) => setSearchStr(e.target.value)}
                    />
                </li>
                {props.userType === "user" ? (
                    <li className="profile-link" onClick={props.profileclick}>
                        {props.user.name}
                    </li>
                ) : (
                    <span></span>
                )}
                <li className="profile-link" onClick={props.onLogOff}>
                    {props.userType === "user" ? "Log Out" : "Register Account"}
                </li>
            </ul>
        </div>
    );
}

export default Banner;
