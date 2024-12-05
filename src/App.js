import React from "react";
import Login from "./Login";
import WorkInput from "./WorkInput";
import WorkSummary from "./WorkSummary";
import SignUp from "./SignUp";

function App() {
  return (
    <div>
      <h1>労働時間管理</h1>
      <SignUp />
      <Login />
      <WorkInput />
      <WorkSummary />
    </div>
  );
}



export default App;