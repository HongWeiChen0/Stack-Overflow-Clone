import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FakeStackOverflow from "./components/fakestackoverflow.js";

// ReactDOM.render(<FakeStackOverflow />, document.getElementById("root"));

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<FakeStackOverflow />);
