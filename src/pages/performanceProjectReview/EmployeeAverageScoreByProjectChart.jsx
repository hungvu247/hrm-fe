import React, { useEffect, useState } from 'react';
import PerformanceProjectReviewService from "../../services/performanceProjectReviewService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const service = new PerformanceProjectReviewService();

export default function EmployeeAverageScoreByProjectChart() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [chartData, setChartData] = useState([]);

    // Fetch all projects on mount
    useEffect(() => {
        service.getAllProjects()
            .then(res => {
                setProjects(res.data);
                if (res.data.length > 0) {
                    setSelectedProjectId(res.data[0].projectId); // Chọn mặc định dự án đầu tiên
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Fetch data khi selectedProjectId thay đổi
    useEffect(() => {
        if (selectedProjectId) {
            service.getEmployeeAverageScorePerProject(selectedProjectId)
                .then(res => setChartData(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedProjectId]);

    return (
        <div>
            <h3>📊 Employee Average Score per Project</h3>
            <select
                value={selectedProjectId || ''}
                onChange={e => setSelectedProjectId(e.target.value)}
                style={{ marginBottom: '20px', padding: '6px' }}
            >
                {projects.map(p => (
                    <option key={p.projectId} value={p.projectId}>
                        {p.projectName}
                    </option>
                ))}
            </select>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="username" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
