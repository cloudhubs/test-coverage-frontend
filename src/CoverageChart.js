import { ChangeEvent, useState } from 'react';
import axios from "axios"
import React from "react";
import { Pie } from "react-chartjs-2";

function CoverageChart({ chartData }) {
    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Endpoint Coverage</h2>
            <Pie
                data={chartData}
                options={{
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: 'rgb(255, 99, 132)'
                            }
                        },
                        title: {
                            display: true,
                            text: "Users Gained between 2016-2020"
                        }
                    }
                }}
            />
        </div>
    );
}

export default CoverageChart;
