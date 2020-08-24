import React, { Component } from 'react';
import axios from "axios";
import preloader from "./assets/images/preloader.gif"
import './Amazon.css';

// default request configs
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

class Amazon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: ""
        }

        this.updateurl = this.updateurl.bind(this);
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

        setTimeout(() => {
            document.querySelector(".preloader").style.display = "block";
        }, 800);
    }

    riseWelcomeDiv() {
        document.querySelector(".welcome-div").classList.remove("drop");
        document.querySelector(".welcome-div").classList.add("rise");

        setTimeout(() => {
            document.querySelector(".preloader").style.display = "none";
        }, 800);
    }

    updateurl(e) {
        this.setState({
            url: e.target.value
        }, () => {
            this.state.url === "" ? this.riseWelcomeDiv() : this.dropWelcomeDiv();

            // fetch from server
            axios({
                method: "POST",
                url: "/product/search",
                data: {
                    url: this.state.url
                }
            }).then(res => {
                const { data } = res;
                console.log(data)
            })
        });
    }

    render() {
        return (
            <div className="body" >
                <div className="first-layer">
                    <h1><span>Ama</span><span>'</span><span>Track</span></h1>
                    <div onFocus={this.addOrangeBorder} onBlur={this.removeOrangeBorder}>
                        <input type="text" className="url-input" spellCheck="false" placeholder="Enter amazon's product link here" value={this.state.url} onChange={this.updateurl} />
                    </div>
                    <a href="https://github.com/keshavDooleea?tab=repositories"
                        target="_blank"><i className="fab fa-github"></i></a>
                </div>
                <div className="sec-layer">
                    <small>Get notified when your favorite item is less expensive or back in stock!</small>
                </div>
                <div className="third-layer">
                    <div className="welcome-div"><i className="fas fa-arrow-circle-up"></i><p>Enter link above</p></div>
                    <img className="preloader" src={preloader} alt="" />
                </div>
            </div>
        );
    }
}

export default Amazon;
