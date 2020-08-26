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
            url: "",
            data: {},
            storage: "imageKeys",
            isScraped: false,
        }

        this.updateurl = this.updateurl.bind(this);
        this.getUrlServer = this.getUrlServer.bind(this);
    }

    componentDidMount() {
        // this.focusFormListener();
        this.checkSession();
    }

    setCookie(c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value =
            escape(value) +
            (exdays === null ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    }

    getCookie(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start === -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start === -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }

    // check if user is visiting for the first time or not
    checkSession() {
        var c = this.getCookie("isFirstTimeAmazon");
        if (c === "no") {
            // welcome back
            console.log("welcome back");
        } else {
            // first time
            console.log("first time")
            localStorage.setItem(this.state.storage, "");
        }
        this.setCookie("isFirstTimeAmazon", "no", null);
    }

    addOrangeBorder() {
        document.querySelector(".first-layer form").classList.add("orange-border");
    }

    removeOrangeBorder() {
        document.querySelector(".first-layer form").classList.remove("orange-border");
    }

    dropWelcomeDiv() {
        document.querySelector(".welcome-div").classList.remove("rise");
        document.querySelector(".welcome-div").classList.add("drop");
    }

    riseWelcomeDiv() {
        document.querySelector(".welcome-div").classList.remove("drop");
        document.querySelector(".welcome-div").classList.add("rise");
    }

    updateurl(e) {
        e.preventDefault();

        this.setState({
            url: e.target.value
        });
    }

    showProductInfo() {
        const data = this.state.data;
        const imgPath = `/screenshots/${data.key}.png`;

        return (
            <div className="third-layer">
                <div className="img-container">
                    <img src={imgPath} alt="" />
                </div>
                <div className="info-container"></div>
            </div >
        );
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    getUrlServer(e) {
        e.preventDefault();

        const storage = localStorage.getItem(this.state.storage);

        this.setState({
            isScraped: false
        });

        // delete existing images.. only 1 image always is left
        if (storage !== null) {
            axios({
                method: "DELETE",
                url: "/product/deleteImg",
                params: {
                    key: storage
                }
            }).then(() => {
                localStorage.setItem(this.state.storage, "");
            })
        }

        if (this.state.url === "") {
            this.riseWelcomeDiv();
        } else if (!this.state.url.startsWith("https://www.amazon.ca/") && !this.state.url.startsWith("www.amazon.ca/") && !this.state.url.startsWith("amazon.ca/")) {
            this.riseWelcomeDiv();
            document.querySelector(".welcome-div p").textContent = "Enter a valid Amazon URL";
            document.querySelector(".welcome-div").classList.add("error-validation");
            return;
        } else {
            this.dropWelcomeDiv();

            // show loading spinner
            document.querySelector(".preloader").style.display = "block";

            // fetch from server
            axios({
                method: "GET",
                url: "/product/scrapeInfo",
                params: {
                    url: this.state.url
                }
            }).then(res => {
                const { data } = res;
                console.log(data)

                this.setState({
                    data: data,
                    isScraped: true
                });

                // save keys to localstorage
                const savedKeys = localStorage.getItem(this.state.storage);
                savedKeys !== null ? localStorage.setItem(this.state.storage, savedKeys + JSON.stringify(data.key)) :
                    localStorage.setItem(this.state.storage, JSON.stringify(data.key));

                // hide loading spinner
                document.querySelector(".preloader").style.display = "none";
            })
        }
    }

    render() {
        return (
            <div className="body" >
                <div className="first-layer">
                    <h1><span>Ama</span><span>'</span><span>Track</span></h1>
                    <form onFocus={this.addOrangeBorder} onBlur={this.removeOrangeBorder}>
                        <input type="text" className="url-input" spellCheck="false" placeholder="Enter amazon's product link here" value={this.state.url} onChange={this.updateurl} />
                        <button type="submit" className="url-btn" onClick={this.getUrlServer}><i className="fas fa-search"></i></button>
                    </form>
                    <a href="https://github.com/keshavDooleea?tab=repositories"
                        target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                </div>
                <div className="sec-layer">
                    <small>Get notified when your favorite item is less expensive or back in stock!</small>
                </div>
                <div className="third-layer">
                    <div className="welcome-div"><i className="fas fa-arrow-circle-up"></i><p>Enter link above</p></div>
                    <img className="preloader" src={preloader} alt="" />
                    {this.state.isScraped ? this.showProductInfo() : null}
                </div>
            </div>
        );
    }
}

export default Amazon;
