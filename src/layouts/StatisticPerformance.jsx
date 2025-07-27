import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ProjectStatisticsChart from "../pages/performanceProjectReview/ProjectStatisticsChart";
import EmployeeAverageScoreByProjectChart from "../pages/performanceProjectReview/EmployeeAverageScoreByProjectChart";
import TopEmployeesChart from "../pages/performanceProjectReview/TopEmployeesChart";
import EmployeeReviewCountChart from "../pages/performanceProjectReview/EmployeeReviewCountChart";
import RoleAverageScoreChart from "../pages/performanceProjectReview/RoleAverageScoreChart";

export default function StatisticPerformance() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>📊 Performance Dashboard</h1>
            <Tabs defaultActiveKey="project" id="performance-tabs" className="mb-3">
                <Tab eventKey="project" title="Project Statistics">
                    <ProjectStatisticsChart />
                </Tab>
                <Tab eventKey="employeeAvg" title="Employee Average Score by Project">
                    <EmployeeAverageScoreByProjectChart />
                </Tab>
                <Tab eventKey="topEmployees" title="Top 5 Employees">
                    <TopEmployeesChart />
                </Tab>
                <Tab eventKey="reviewCount" title="Employee Review Count">
                    <EmployeeReviewCountChart />
                </Tab>
                <Tab eventKey="roleAvg" title="Average Score by Role">
                    <RoleAverageScoreChart />
                </Tab>
            </Tabs>
        </div>
    );
}
