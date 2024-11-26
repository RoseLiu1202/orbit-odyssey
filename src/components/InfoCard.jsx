import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import timelineData from "./../data/timelineData.json";
import "../styles/InfoCard.css";

const countryFlags = {
    USA: "🇺🇸",
    USSR: "☭",
    Europe: "🇪🇺",
    UK: "🇬🇧",
    Canada: "🇨🇦",
    Japan: "🇯🇵",
    China: "🇨🇳",
    India: "🇮🇳",
    Italy: "🇮🇹",
    Russia: "🇷🇺",
    Poland: "🇵🇱",
    France: "🇫🇷",
};

const discoveryTypeLabels = {
    TechAdvance: "🛸 Technological Achievement",
    HumanInSpace: "👨‍🚀 Human Spaceflight",
    Contact: "🌍 Planetary Exploration",
};

const InfoCard = ({ year, viewMode }) => {
    const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
    const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [currentContent, setCurrentContent] = useState(null);
    const [totalSteps, setTotalSteps] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const yearData = timelineData.find((entry) => entry.year === year);

    const getCountryDisplay = (country) => {
        const mainCountry = country.split("(")[0].trim();
        const flag = countryFlags[mainCountry] || "";
        return `${flag} ${country}`;
    };

    const getFormattedType = (type) => discoveryTypeLabels[type] || type;

    const getAllHighlights = (discovery) => {
        const highlights = [];
        Object.keys(discovery).forEach((key) => {
            if (key.startsWith("TechAdvance")) {
                highlights.push({ text: discovery[key], type: "TechAdvance" });
            } else if (key.startsWith("HumanInSpace")) {
                highlights.push({ text: discovery[key], type: "HumanInSpace" });
            } else if (key.startsWith("Contact")) {
                highlights.push({ text: discovery[key], type: "Contact" });
            }
        });
        return highlights;
    };

    useEffect(() => {
        if (yearData) {
            let total = 0;
            yearData.discoveries.forEach((discovery) => {
                total += getAllHighlights(discovery).length;
            });
            setTotalSteps(total);
        }
    }, [yearData]);

    useEffect(() => {
        if (!yearData) return;

        const currentMission = yearData.discoveries[currentMissionIndex];
        if (!currentMission) return;

        const highlights = getAllHighlights(currentMission);
        if (!highlights.length) return;

        let currentStepCount = 0;
        for (let i = 0; i < currentMissionIndex; i++) {
            currentStepCount += getAllHighlights(yearData.discoveries[i]).length;
        }
        currentStepCount += currentHighlightIndex;
        setCurrentStep(currentStepCount);

        setCurrentContent({
            missionName: currentMission.missionName,
            country: currentMission.country,
            currentHighlight: highlights[currentHighlightIndex] || null,
        });

        const showNextHighlight = () => {
            if (currentHighlightIndex < highlights.length - 1) {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrentHighlightIndex((prev) => prev + 1);
                    setIsVisible(true);
                }, 1000);
            } else if (currentMissionIndex < yearData.discoveries.length - 1) {
                setIsVisible(false);
                setTimeout(() => {
                    setCurrentMissionIndex((prev) => prev + 1);
                    setCurrentHighlightIndex(0);
                    setIsVisible(true);
                }, 1000);
            }
        };

        const timer = setTimeout(showNextHighlight, 3000);
        return () => clearTimeout(timer);
    }, [yearData, currentMissionIndex, currentHighlightIndex]);

    useEffect(() => {
        setCurrentMissionIndex(0);
        setCurrentHighlightIndex(0);
        setIsVisible(true);
        setCurrentStep(0);
    }, [year]);

    const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

    if (!yearData) {
        return <div className="info-card-container">No data available for this year</div>;
    }

    return (
        <div className="info-card-container">
            {currentContent && (
                <>
                    <div className="top-content">
                        <div className={`year-display ${isVisible ? "fade-in" : "fade-out"}`}>
                            {yearData.year}
                        </div>
                        <div className={`mission-info ${isVisible ? "fade-in" : "fade-out"}`}>
                            <div className="mission-name">Mission: {currentContent.missionName}</div>
                            {viewMode === "country" && (
                                <div
                                    className="country-flag"
                                    dangerouslySetInnerHTML={{
                                        __html: getCountryDisplay(currentContent.country),
                                    }}
                                />
                            )}
                            {viewMode === "discovery" && (
                                <div className="discovery-type">
                                    {getFormattedType(currentContent.currentHighlight?.type || "")}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="content-wrapper">
                        <div className={`highlight-content ${isVisible ? "fade-in" : "fade-out"}`}>
                            <div className="highlight-text">
                                {currentContent.currentHighlight?.text || "No highlight available"}
                            </div>
                        </div>
                    </div>
                    <div className="progress-section">
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{
                                    transform: `translateX(${progressPercentage - 100}%)`,
                                }}
                            />
                        </div>
                        <div className="progress-counter">
                            {currentStep + 1}/{totalSteps}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

InfoCard.propTypes = {
    year: PropTypes.number,
    viewMode: PropTypes.oneOf(["country", "discovery"]).isRequired,
};

export default InfoCard;
