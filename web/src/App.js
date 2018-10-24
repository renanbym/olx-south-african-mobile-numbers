import React, { Component } from "react";
import HomeView from "./HomeView";

class App extends Component {

  render() {

    return (
      <div className="App">
        <div className="ui container">
          <HomeView/>
        </div>
      </div>
    );
  }


}

export default App;
