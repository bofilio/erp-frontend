import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Nombre de couriers par mois',
        },
    },
};

const labels = ['Jan', 'Fév ', 'Mar', 'Avr', 'Juin', 'Juil', 'août','Sep','Oct','Nov','Dec'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Sortant',
            data: labels.map(() => Math.floor(Math.random() * 100)),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Entrant',
            data: labels.map(() => Math.floor(Math.random() * 100)),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export function Example() {
    return (
        <Card variant="outlined" sx={{ padding: 1 }}>
            <Bar options={options} data={data} height={300} />
        </Card>
    );
}
