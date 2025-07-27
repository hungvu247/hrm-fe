import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceProjectReviewService from '../../services/performanceProjectReviewService';

const service = new PerformanceProjectReviewService();

export default function RoleAverageScoreChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        service.getRoleAverageScorePerProject()
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h3>🧑‍💼 Average Score by Role per Project</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#a4de6c" name="Average Score" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
