import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import ContainerLayout from "../../../components/ContainerLayout";
import { FaChartLine } from "react-icons/fa";

// Registrasi elemen chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Menambahkan PointElement
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lineChartData = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    datasets: [
      {
        label: "Pengunjung Harian",
        data: [45, 52, 38, 45, 19, 23, 2],
        fill: false,
        borderColor: "rgba(255, 165, 0, 1)",
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
  }, []);

  return (
    <ContainerLayout>
      <div className="py-12">
        <div className="flex gap-4 items-center mb-4">
          <FaChartLine size={24} />
          <h2 className="text-lg font-semibold ">Grafik Analitik</h2>
        </div>

        <div className="mb-8">
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                },
              },
            }}
          />
        </div>
      </div>
    </ContainerLayout>
  );
};

export default Charts;
