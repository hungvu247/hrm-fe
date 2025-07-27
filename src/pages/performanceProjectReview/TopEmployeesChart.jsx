import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceProjectReviewService from '../../services/performanceProjectReviewService';

const service = new PerformanceProjectReviewService();

export default function TopEmployeesChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        service.getTop5Employees()
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h3>🏆 Top 5 Employees by Average Score</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#ffc658" name="Average Score" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
