import React from 'react'
import { Chart as ChartJS} from "chart.js/auto";
import { Doughnut, Line, Bar } from "react-chartjs-2";

export function Chart({chartData, line, doughnut, bar}) {

  return (
    <div>
        {line ? <Line data={chartData} options={{responsive: true, maintainAspectRatio: false}}/> : ""}
        {doughnut ? <Doughnut data={chartData} options={{responsive: true, maintainAspectRatio: false}}/> : ""}
        {bar ? <Bar data={chartData} options={{responsive: true, maintainAspectRatio: false}} /> : "" }
    </div>
  )
}
