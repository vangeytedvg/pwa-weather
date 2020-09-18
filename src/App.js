import React, { useState, useEffect } from "react";
import { getCardinal } from "./utils/WindDirections";
import { fetchWeather } from "./api/fetchWeather";
import CookieConsent from "react-cookie-consent";
import cookie from "react-cookies";
import { motion } from "framer-motion";
import useSound from "use-sound";
import errorSound from "./sounds/errorentry.wav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

toast.configure();

const App = () => {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});
    // Used for storing the current selected location
    const [remember, setRemember] = useState(false);
    const [play] = useSound(errorSound);

    // Execute the search
    const search = async (e) => {
        if (e.key === "Enter") {
            const data = await fetchWeather(query)
                .then((data) => {
                    setWeather(data);
                    setQuery("");
                    setRemember(false);
                })
                .catch((err) => {
                    play();
                    setQuery("");
                    setRemember(false);
                    return toast("Could not find entered location!", {
                        position: toast.POSITION.TOP_RIGHT,
                        type: "error",
                        autoClose: 3000,
                    });
                });
        }
    };

    const rememberLocation = (e) => {
        // Store the location as a cookie
        setRemember(e.target.checked);
        // Store the default location as a cookie
        cookie.save("default_weather_location", query);
    };

    useEffect(() => {
        const myLocation = cookie.load("default_weather_location");
        if (myLocation) {
            setRemember(true);
            setQuery(myLocation);
        } else {
            console.log("No location stored");
            setRemember(false);
        }
    }, []);

    return (
        <>
            <CookieConsent
                location="bottom"
                buttonText="Yep"
                cookieName="myAwesomeCookieName2"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                expires={150}
            >
                Do you like cookies?{" "}
                <span style={{ fontSize: "10px" }}>
                    Sorry, but it's the law!
                </span>
            </CookieConsent>
            <div className="main-container">
                <motion.input
                    type="text"
                    className="search"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={search}
                    autoFocus
                    initial={{ y: -1000 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                    whileHover = {{
                      scale: 1.1,
                      textShadow: "0px 0px 8px rgb(255,255,255)",
                      boxShadow: "0px 0px 15px rgb(20,255,255)"
                    }}
                />
                <motion.div
                    className="remember"
                    initial={{ x: -1000 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                    whileHover = {{
                      textShadow: "0px 0px 18px rgb(0,255,0)",
                    }}
                >
                    <input
                        type="checkbox"
                        onChange={rememberLocation}
                        checked={remember}
                        initial={{ y: -1000 }}
                        animate={{ y: 0 }}
                        transition={{
                            delay: 0.5,
                            type: "spring",
                            stiffness: 120,
                        }}
                    />
                    <label className="remember-label" htmlFor="remember">
                        Remember location
                    </label>
                </motion.div>
                {weather.main && (
                    <motion.div className="flip-card"
                      initial={{ x: '100vw'}}
                      animate={{ x: 0 }}
                      transition={{type:"spring", delay:0.5}}
                    >
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <div className="city">
                                    <h2 className="city-name">
                                        <span>{weather.name}</span>
                                        <sup>{weather.sys.country}</sup>
                                    </h2>
                                    <div className="city-temp">
                                        {Math.round(weather.main.temp)}
                                        <sup>&deg;C</sup>
                                    </div>
                                    <div className="info">
                                        <img
                                            className="city-icon"
                                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                            alt={weather.weather[0].description}
                                        />
                                        <p>{weather.weather[0].description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flip-card-back">
                                <h1 className="card-back-title">Detail</h1>
                                <div className="feels-like">
                                    Feels like{" "}
                                    <span className="info-label">
                                        {Math.round(weather.main.feels_like)}
                                        <sup>&deg;C</sup>
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Humidity{" "}
                                    <span className="info-label">
                                        {Math.round(weather.main.humidity)}
                                        <sup>%</sup>
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Pressure{" "}
                                    <span className="info-label">
                                        {weather.main.pressure}
                                        <sup>hPa</sup>
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Wind direction{" "}
                                    <span className="info-label">
                                        {getCardinal(weather.wind.deg)}
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Wind speed{" "}
                                    <span className="info-label">
                                        {weather.wind.speed}
                                        <sup>km/h</sup>
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Visibility{" "}
                                    <span className="info-label">
                                        {weather.visibility / 1000}
                                        <sup>km</sup>
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Sunrise{" "}
                                    <span className="info-label">
                                        {new Date(
                                            weather.sys.sunrise * 1000
                                        ).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="feels-like">
                                    Sunset{" "}
                                    <span className="info-label">
                                        {new Date(
                                            weather.sys.sunset * 1000
                                        ).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default App;
