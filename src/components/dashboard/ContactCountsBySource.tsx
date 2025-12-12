'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ContactsBySourceRow } from "@/lib/definitions/backend/contacts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ContactCountsBySourceProps {
    contactCounts: ContactsBySourceRow[];
}

export default function ContactCountsBySourceChart({ contactCounts }: ContactCountsBySourceProps) {
    // Prepare data for chart.js
    const labels = contactCounts.map(row => (row.Source.Valid ? row.Source.String : '—'));
    const dataValues = contactCounts.map(row => row.ContactCount);

    const data = {
        labels,
        datasets: [
            {
                label: 'Contacts by Source',
                data: dataValues,
                backgroundColor: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: { autoSkip: false },
            },
            y: {
                beginAtZero: true,
            },
        },
        datasets: {
            bar: {
                maxBarThickness: 50, // max width in pixels
            },
        },
    };

    return (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Bar data={data} options={options} />
        </div>
    );
}
