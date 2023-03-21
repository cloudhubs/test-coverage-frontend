import React from "react";
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';

export let gatlingData = [
    { name: 'Fully', value: 0 },
    { name: 'Not', value: 1 },
];

export const COLORS = ['#2fd91d', '#ce1212'];

export const RADIAN = Math.PI / 180;

export const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

let GatlingPieChart = () => {

    return (
        <>
            <div>
                <div class="row d-flex justify-content-left text-center">
                    <hr />
                    <div className="col-md-8">
                        <ResponsiveContainer width={window.innerWidth / 3 - 100} height={window.innerWidth / 3 - 100} className="text-center">
                            <PieChart width={window.innerWidth / 3 - 100} height={window.innerWidth / 3 - 100}>
                                <Legend layout="vertical" verticalAlign="top" align="top" />
                                <Pie
                                    data={gatlingData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={(window.innerWidth / 3 - 100) / 3}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {gatlingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
export default GatlingPieChart;