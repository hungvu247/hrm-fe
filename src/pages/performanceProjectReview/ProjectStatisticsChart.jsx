import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceProjectReviewService from '../../services/performanceProjectReviewService';

const service = new PerformanceProjectReviewService();

export default function ProjectStatisticsChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        service.getProjectStatistics()
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h3>📊 Total Reviews per Project</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="projectName" /> {/* dùng projectName thay vì projectId */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalReviews" fill="#8884d8" name="Total Reviews" />
                </BarChart>
            </ResponsiveContainer>

            <h3>📈 Average Score per Project</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="projectName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke="#82ca9d" name="Average Score" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
