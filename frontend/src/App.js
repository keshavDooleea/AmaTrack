import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: ""
    }

    this.updateURL = this.updateURL.bind(this);
  }

  componentDidMount() {
    // this.focusFormListener();
  }

  prevent(e) {
    e.preventDefault();
  }

  addOrangeBorder() {
    document.querySelector(".first-layer div").classList.add("orange-border");
  }

  removeOrangeBorder() {
    document.querySelector(".first-layer div").classList.remove("orange-border");
  }

  dropWelcomeDiv() {
    document.querySelector(".welcome-div").classList.remove("rise");
    document.querySelector(".welcome-div").classList.add("drop");
  }

  riseWelcomeDiv() {
    document.querySelector(".welcome-div").classList.remove("drop");
    document.querySelector(".welcome-div").classList.add("rise");
  }

  updateURL(e) {
    this.setState({
      url: e.target.value
    })

    console.log(this.state.url)

    // fetch from server
    this.dropWelcomeDiv();
  }

  render() {
    return (
      <div className="body" >
        <div className="first-layer">
          <h1><span>Ama</span><span>'</span><span>Track</span></h1>
          <div onFocus={this.addOrangeBorder} onBlur={this.removeOrangeBorder}>
            <input type="text" className="url-input" spellCheck="false" placeholder="Enter amazon's product link here" value={this.state.url} onChange={this.updateURL} />
          </div>
          <a href="https://github.com/keshavDooleea?tab=repositories"
            target="_blank"><i className="fab fa-github"></i></a>
        </div>
        <div className="sec-layer">
          <small>Get notified when your favorite item is less expensive or back in stock!</small>
        </div>
        <div className="third-layer">
          <div className="welcome-div"><i className="fas fa-arrow-circle-up"></i><p>Enter link above</p></div>

          {/* {this.state.url === "" ? this.riseWelcomeDiv : this.dropWelcomeDiv} */}
        </div>
      </div>
    );
  }
}

export default App;
