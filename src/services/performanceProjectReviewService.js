import axios from "axios";

export default class PerformanceProjectReviewService {
    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    getProjectStatistics() {
        return axios.get(
            `https://localhost:7000/api/PerformanceProjectReview/statistics`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }
    getAllProjects() {
        return axios.get("https://localhost:7000/api/PerformanceProjectReview/projects");
    }

    getEmployeeAverageScorePerProject(projectId) {
        return axios.get(`https://localhost:7000/api/PerformanceProjectReview/statistics/employee-average`, {
            params: { projectId }
        });
    }


    getTop5Employees() {
        return axios.get(
            `https://localhost:7000/api/PerformanceProjectReview/statistics/top5-employees`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getEmployeeReviewCount() {
        return axios.get(
            `https://localhost:7000/api/PerformanceProjectReview/statistics/employee-review-count`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }

    getRoleAverageScorePerProject() {
        return axios.get(
            `https://localhost:7000/api/PerformanceProjectReview/statistics/role-average`,
            {
                headers: this.getAuthHeaders(),
            }
        );
    }
}
