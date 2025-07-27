import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceProjectReviewService from '../../services/performanceProjectReviewService';

const service = new PerformanceProjectReviewService();

export default function EmployeeAverageScoreChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        service.getEmployeeAverageScorePerProject()
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h3>📊 Employee Average Score per Project</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" /> {/* dùng username cho dễ đọc */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
