import FileUploadButton from './FileUploadButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Data } from "./Data.js";
import CoverageChart from "./CoverageChart";
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    console.log(theme)
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  /*
    const [chartData, setChartData] = useState({
        labels: Data.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained ",
                data: Data.map((data) => data.total),
                backgroundColor: [
                    "rgb(54,144,22)",
                    "#e5c649",
                    "#992313",
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });
    */

  const chartData = {
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.total),
        backgroundColor: [
          "rgb(54,144,22)",
          "#e5c649",
          "#992313",
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  }
  

  return (
   <>
    <div className={`App ${theme}`}>
      <Button variant={theme === 'light' ? "primary" : "dark"} onClick={toggleTheme}>Toggle Theme</Button>
    </div>
    <div>
      <FileUploadButton theme={theme}/>
    </div>  
    <div style={/*TODO: change to use % */ {width: "400px", height: "400px"}}>
        <CoverageChart  chartData={chartData} />
    </div>
    </>
  );
}