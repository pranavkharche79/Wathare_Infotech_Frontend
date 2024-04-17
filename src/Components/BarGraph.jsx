import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Heading } from "@chakra-ui/react";
import axios from "axios";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import WeatherApp from "./WeatherApp";
import { jsondata } from "./Sampledata";
Chart.register(CategoryScale);

export default function BarGraph() {
  const [data, setData] = useState([]);
  const intensityData = data.map((item) => item.machine_status);
  const sampledata = [...intensityData];
  const msdata = sampledata.map((item) => (item = 1));

  const timeconverter = (ts) => {
    const dateObject = new Date(ts);

    const timeString = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return timeString;
  };

  const time = data.map((item) => {
    return timeconverter(item.ts);
  });
  useEffect(() => {
    const fetchDataFromApi = async () => {
      const API_URL = "http://localhost:8000";
      try {
        const response = await axios.get(`${API_URL}/api/data`);
        setData(response.data);
      } catch (error) {
        setData(jsondata);
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
  }, []);

  const getColor = (value) => {
    const colors = [
      "yellow", // Yellow
      "green", // Green
      "red", // Red
    ];
    if (value === 0) {
      return colors[0];
    } else if (value === 1) {
      return colors[1];
    } else {
      return colors[2];
    }
  };

  const chartData = {
    labels: time,
    datasets: [
      {
        // label: "Intensity",
        backgroundColor: intensityData.map((value) => getColor(value)),
        // borderColor: "rgba(0,0,0,1)",
        // borderWidth: 1,
        data: msdata,
        barPercentage: 1, // Adjust the width of bars relative to the axis
        categoryPercentage: 1,
      },
    ],
  };

  const chartOptions = {
    layout: {
      padding: {
        top: 20,
        bottom: 500,
        left: 20,
        right: 20,
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "white",
        borderWidth: 1,
        cornerRadius: 5,
        displayColors: true,
      },
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "start",
        offset: 100,
        font: {
          size: 0,
          weight: "bold",
        },
        // formatter: (value) => value + "%",
        shadowBlur: 10,
        shadowColor: "white",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        barThickness: 50, // Set the width of the bars
        ticks: {
          font: {
            family: "Roboto",
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "Roboto",
            size: 14,
            weight: "bold",
          },
          //   callback: (value) => value,
        },
      },
    },
    animation: {
      duration: 4000,
      easing: "easeInOutQuart", // Use a smooth easing function
      mode: "progressive",
    },
  };

  return (
    <>
      <WeatherApp />
      <div
        style={{
          width: "80%",
          paddingTop: "100px",
          paddingLeft: "100px",
        }}
      >
        {" "}
        {/* Set height here */}
        <Heading as="h2" mb={4}>
          Cycle Status
        </Heading>
        <div style={{ textAlign: "center" }}>
          <strong>Legend:</strong>
          <br />
          <strong>Machine status = 1:</strong>
          <span
            style={{
              backgroundColor: "green",
              width: "40px",
              height: "20px",
              display: "inline-block",
            }}
          ></span>
          <br />
          <strong>Machine status = 0:</strong>
          <span
            style={{
              backgroundColor: "yellow",
              width: "40px",
              height: "20px",
              display: "inline-block",
            }}
          ></span>
          <br />
          <strong>Machine status = Null:</strong>
          <span
            style={{
              backgroundColor: "red",
              width: "40px",
              height: "20px",
              display: "inline-block",
            }}
          ></span>
        </div>
        <br />
        <Bar
          style={{ width: "100%" }}
          data={chartData}
          options={chartOptions}
          plugins={[ChartDataLabels]}
        />
      </div>
    </>
  );
}
