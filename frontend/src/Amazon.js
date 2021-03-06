import React, { Component } from 'react';
import axios from "axios";
import preloader from "./assets/images/preloader.gif"
import './Amazon.css';

// default request configs
axios.defaults.baseURL = 'http://localhost:5000';
// axios.defaults.baseURL = 'https://amatrack.herokuapp.com/';
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

    notifyMe(e) {
        e.preventDefault();

        const inputPrice = document.querySelector(".input-price").value;
        const email = document.querySelector(".input-email").value;
        const warningText = document.querySelector(".warning-text");
        const data = this.state.data;

        if (inputPrice === "") {
            warningText.textContent = "Enter an amount above 0";
        } else if (inputPrice >= data.totalPrice) {
            warningText.textContent = `Enter a lower amount than ${data.totalPrice}`;
        } else if (email.length < 6 || !email.includes("@") || !email.includes(".")) {
            warningText.textContent = "Invalid email entered";
        } else {
            // all good here
            warningText.textContent = "";

            document.querySelector(".desired-action button").style.display = "none";
            document.querySelector(".email-preloader").style.display = "block";

            axios({
                method: "POST",
                url: "/product/insertDB",
                data: {
                    email,
                    key: data.key,
                    title: data.title,
                    actualPrice: data.totalPrice,
                    desiredPrice: inputPrice,
                    url: this.state.url
                }
            }).then(res => {
                console.log(res.data);
                if (res.data.status === 200) {
                    document.querySelector(".notify-price").textContent = inputPrice;
                    document.querySelector(".notify-email").textContent = email;
                    document.querySelector(".info-container").classList.add("sucess-response-result");
                } else if (res.data.status === 400) {
                    document.querySelector(".error-detail p").textContent = res.data.message;
                    document.querySelector(".info-container").classList.add("error-response-result");
                }
            })
        }
    }

    bringBackInfo() {
        document.querySelector(".desired-action button").style.display = "block";
        document.querySelector(".email-preloader").style.display = "none";
        document.querySelector(".info-container").classList.remove("error-response-result");
        document.querySelector(".input-email").value = "";
    }

    showProductInfo() {
        const data = this.state.data;

        return (
            <div className="third-layer">
                <a className="img-container" href={this.state.url} target="_blank" rel="noopener noreferrer">
                    <img src={`data:image/jpeg;base64,${data.base64img}`} alt="" />
                </a>
                <div className="info-container">
                    <div className="actual-info">
                        <div>
                            <h4>{data.title}</h4>
                        </div>
                        <div>
                            <p>Total price: <span>$ {data.totalPrice}</span> (inc $ <span>{data.shipping}</span> shipping)</p>
                            <p>In stock? <span>{data.stockNb}</span></p>
                        </div>
                    </div>
                    <form className="desired-info">
                        <div className="desired-header">
                            <h4>Notify me when...</h4>
                        </div>
                        <div className="desired-body">
                            <div>
                                <p>Item is back in stock</p>
                                <input type="checkbox" disabled={true} className="disabled input-stock" />
                            </div>
                            <div>
                                <p>Total price is less than</p>
                                <input type="number" className="input-price" />
                            </div>
                            <div>
                                <p>Enter your email</p>
                                <input type="email" spellCheck={false} className="input-email" />
                            </div>
                            <div className="warning-div">
                                <p className="warning-text"></p>
                            </div>
                        </div>
                        <div className="desired-action">
                            <button type="submit" onClick={(e) => this.notifyMe(e)}>
                                <i className="fas fa-envelope-square"></i>
                                Notify me</button>
                            <img className="email-preloader" src={preloader} alt="" />
                        </div>
                    </form>

                    {/* hidden underneath containers   */}
                    <div className="success-response-container">
                        <div className="success-top">
                            <i className="fas fa-check-square"></i>
                            <h4>Success</h4>
                        </div>
                        <div className="success-sec">
                            <p>You will be notified when the price drops below $<span className="notify-price"></span> at <span className="notify-email"></span>!</p>
                        </div>
                        <div className="success-third">
                            <h4>{data.key}</h4>
                            <p>Enter the above key under <span>Unsubscribe</span> to stop receiving an alert.</p>
                        </div>
                        <div className="success-forth">
                            <small>Don't Worry! <span role="img" aria-label="smile">😄</span><br />You must have received an email containing all these informations.</small>
                        </div>
                        <div className="success-bottom">
                            <a href="/">Done</a>
                        </div>
                    </div>

                    <div className="error-response-container">
                        <div className="error-header">
                            <i className="fas fa-times-circle"></i>
                            <h4>Sorry!</h4>
                            <p>Some kind of error occured! <span role="img" aria-label="sad">😞</span></p>
                        </div>
                        <div className="error-detail">
                            <p></p>
                        </div>
                        <div className="success-bottom">
                            <button className="error-retry-btn" onClick={this.bringBackInfo}>Retry</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    getUrlServer(e) {
        e.preventDefault();

        this.setState({
            isScraped: false
        });

        // delete existing images.. only 1 image always is left
        // if (storage !== null) {
        //     axios({
        //         method: "DELETE",
        //         url: "/product/deleteImg",
        //         params: {
        //             key: storage
        //         }
        //     }).then(() => {
        //         localStorage.setItem(this.state.storage, "");
        //     })
        // }

        if (this.state.url === "") {
            this.riseWelcomeDiv();
            document.querySelector(".welcome-div p").textContent = "Enter a valid Amazon URL";
            document.querySelector(".welcome-div").classList.add("error-validation");
        } else if (!this.state.url.startsWith("https://www.amazon.ca/") && !this.state.url.startsWith("www.amazon.ca/") && !this.state.url.startsWith("amazon.ca/")) {
            this.riseWelcomeDiv();
            document.querySelector(".welcome-div p").textContent = "Enter a valid Amazon URL";
            document.querySelector(".welcome-div").classList.add("error-validation");
            return;
        } else {
            document.querySelector(".welcome-div p").textContent = "All good!";
            document.querySelector(".welcome-div").classList.add("success-validation");
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
                console.log(data);

                this.setState({
                    data: data,
                    isScraped: true
                });

                // save keys to localstorage
                // const savedKeys = localStorage.getItem(this.state.storage);
                // savedKeys !== null ? localStorage.setItem(this.state.storage, savedKeys + JSON.stringify(data.key)) :
                //     localStorage.setItem(this.state.storage, JSON.stringify(data.key));

                // hide loading spinner
                document.querySelector(".preloader").style.display = "none";
                document.querySelector(".url-input").value = "";
            })
        }
    }

    render() {
        return (
            <div className="body" >
                <div className="first-layer">
                    <a className="amazon" href="https://www.amazon.ca/" target="_blank" rel="noopener noreferrer">
                        <h1><span>Ama</span><span>'</span><span>Track</span><span>ca</span></h1>
                    </a>
                    <form onFocus={this.addOrangeBorder} onBlur={this.removeOrangeBorder}>
                        <input type="text" className="url-input" spellCheck="false" placeholder="Enter amazon's product link here" value={this.state.url} onChange={this.updateurl} />
                        <button type="submit" className="url-btn" onClick={this.getUrlServer}><i className="fas fa-search"></i></button>
                    </form>
                    <a className="github" href="https://github.com/keshavDooleea?tab=repositories"
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
