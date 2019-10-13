import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  return (
    <div style={{ height: "100%" }}>
      <Route path="/" component={Dashboard} />
    </div>
  );
};

export default App;
