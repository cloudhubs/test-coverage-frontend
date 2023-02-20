import FileUploadButton from './FileUploadButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from "react";
import { Data } from "./Data.js";
import CoverageChart from "./CoverageChart";
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

export default function App() {

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
      <div>
          <FileUploadButton/>
          
          <div style={/*TODO: change to use % */ {width: "400px", height: "400px"}}>
              <CoverageChart  chartData={chartData} />
          </div>
      </div>
  );
}