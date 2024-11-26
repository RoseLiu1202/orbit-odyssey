import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import "../styles/Timeline.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
} from "chart.js";
import timelineData from "./../data/timelineData.json";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

const Timeline = ({ onYearChange, onYearHover, viewMode }) => { // Receive viewMode as a prop
    // Colors for the "type of discovery" mode
    const discoveryColors = {
        TechAdvance: "#f39c12",
        Contact: "#8e44ad",
        HumanInSpace: "#16a085",
    };

    // Colors for the "country" mode
    const countryColors = {
        USA: "#0c2868",
        USSR: "#cd0000",
        UK: "#FFFFFF",
        Europe: "#e2bc19",
        Canada: "#e6776e",
        Japan: "#ecb8c8",
        China: "#5e030d",
        India: "#f85c24",
        Poland: "#d81444",
        Netherlands: "#2773fd",
        France: "#0494e4",
        Russia: "#dc586c",
        Italy: "#008C45",
    };

    const labels = timelineData.map((entry) => entry.year);
    const datasets = [];

    if (viewMode === "country") {
        timelineData.forEach(({ year, numberOfEvents, countriesInvolved }) => {
            const yearIndex = labels.indexOf(year);
            const segmentHeight = numberOfEvents / (countriesInvolved.length || 1);

            countriesInvolved.forEach((country) => {
                const trimmedCountry = country.trim();
                const color = countryColors[trimmedCountry] || "black";

                const existingDataset = datasets.find((dataset) => dataset.label === trimmedCountry);
                if (existingDataset) {
                    existingDataset.data[yearIndex] = segmentHeight;
                } else {
                    datasets.push({
                        label: trimmedCountry,
                        data: Array(labels.length).fill(0),
                        backgroundColor: color,
                        borderWidth: 0,
                        borderColor: "black",
                    });
                    datasets[datasets.length - 1].data[yearIndex] = segmentHeight;
                }
            });
        });
    } else if (viewMode === "discovery") {
        timelineData.forEach(({ year, discoveries }) => {
            const yearIndex = labels.indexOf(year);

            const discoveryTypes = [
                { type: "TechAdvance", color: discoveryColors.TechAdvance },
                { type: "Contact", color: discoveryColors.Contact },
                { type: "HumanInSpace", color: discoveryColors.HumanInSpace },
            ];

            discoveryTypes.forEach(({ type, color }) => {
                const totalDiscoveries = discoveries.reduce((total, discovery) => {
                    return total + Object.keys(discovery).filter((key) => key.startsWith(type)).length;
                }, 0);

                const existingDataset = datasets.find((dataset) => dataset.label === type);
                if (existingDataset) {
                    existingDataset.data[yearIndex] = totalDiscoveries || 0;
                } else {
                    datasets.push({
                        label: type,
                        data: Array(labels.length).fill(0),
                        backgroundColor: color,
                        borderWidth: 0,
                        borderColor: "black",
                    });
                    datasets[datasets.length - 1].data[yearIndex] = totalDiscoveries || 0;
                }
            });
        });
    }

    const chartData = { labels, datasets };

    const options = {
        indexAxis: "y",
        scales: {
            x: {
                title: { display: true, text: "Number of Key Progress" },
                beginAtZero: true,
                stacked: true,
            },
            y: {
                title: { display: true, text: "Year" },
                stacked: true,
                ticks: { autoSkip: false },
            },
        },
        plugins: {
            legend: {
                position: "right",
                title: {
                    display: true,
                    text: viewMode === "country" ? "Countries" : "Types of Discovery",
                },
            },
            title: {
                display: true,
                text: "Interactive Timeline of Global Space Exploration",
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: { bar: { barThickness: 5 } },
        onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
                const yearIndex = chartElement[0].index;
                const year = labels[yearIndex];
                onYearHover?.(year);
            }
        },
        onClick: (event, chartElement) => {
            if (chartElement.length > 0) {
                const yearIndex = chartElement[0].index;
                const year = labels[yearIndex];
                onYearChange?.(year);
            }
        },
    };

    return (
        <div style={{ height: "900px", width: "100%" }}>
            {/* Bar chart */}
            <Bar data={chartData} options={options} />
        </div>
    );
};

Timeline.propTypes = {
    onYearChange: PropTypes.func,
    onYearHover: PropTypes.func,
    viewMode: PropTypes.string.isRequired, // Add this to PropTypes
};

export default Timeline;
