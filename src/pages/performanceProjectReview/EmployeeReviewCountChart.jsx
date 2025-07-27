import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PerformanceProjectReviewService from '../../services/performanceProjectReviewService';

const service = new PerformanceProjectReviewService();

export default function EmployeeReviewCountChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        service.getEmployeeReviewCount()
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <h3>📊 Total Reviews per Employee</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalReviews" fill="#ff8042" name="Total Reviews" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
