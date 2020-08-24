import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// to access params in url: this.props.match.params.id

// components
import Amazon from "./Amazon";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path={["/", "/amazon"]} strict component={Amazon}></Route>
      </Router>
    );
  }
}

export default App;