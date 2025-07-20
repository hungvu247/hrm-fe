import { useEffect, useState } from "react";
import {
    Button,
    Dropdown,
    Grid,
    Input,
    Table,
} from "semantic-ui-react";
import EmployeeProjectService from "../../services/employeeProjectService";
import EmployeeService from "../../services/employeeService";
import PaginationControl from "../../layouts/Util/PaginationControl";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeProjectList() {
    const { id } = useParams();
    const [keyword, setKeyword] = useState("");
    const [employeeId, setEmployeeId] = useState();
    const [projectId, setProjectId] = useState(id || null);

    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);

    const [employeeProjects, setEmployeeProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const navigate = useNavigate();
    const service = new EmployeeProjectService();

    // ✅ Lấy danh sách Employee + Project (Project đang hardcode)
    useEffect(() => {
        const employeeService = new EmployeeService();
        const employeeProjectService = new EmployeeProjectService();
        employeeProjectService.getAllEmployee()
            .then(res => {
                console.log(res);
                const options = res.data.map(e => ({
                    key: `employee-${e.EmployeeId}`,
                    text: `${e.Username}`,
                    value: e.EmployeeId,
                }));
                setEmployees(options);
            });

        // ✅ Hard-code project
        const hardcodedProjects = [
            { key: "project-1", text: "Project A", value: 1 },
            { key: "project-2", text: "Project B", value: 2 },
            { key: "project-3", text: "Project C", value: 3 },
        ];
        setProjects(hardcodedProjects);
    }, []);

    // ✅ Fetch EmployeeProject
    useEffect(() => {
        const dto = {
            Keyword: keyword,
            EmployeeId: employeeId || null,
            ProjectId: projectId || null,
            Page: currentPage,
            PageSize: pageSize,
        };

        service.getAll(dto)
            .then(res => {
                console.log("✅ RESPONSE RAW:", res.data);

                setEmployeeProjects(res.data.data || []);

                const totalRecords = res.data.totalRecords || 0;
                const pages = Math.ceil(totalRecords / pageSize) || 1;
                setTotalPages(pages);
            })
            .catch(err => console.error("Lỗi khi lấy employee-project:", err));
    }, [keyword, employeeId, projectId, currentPage, pageSize]);

    const goToAdd = () => {
        if (projectId) {
            navigate(`/dashboard/employee-projects/add/${projectId}`);
        } else {
            navigate("/dashboard/employee-projects/add");
        }
    };

    const goToEdit = (ep) => {
        // 🔑 Bên BE nên trả kèm EmployeeId & ProjectId để edit
        navigate(`/dashboard/employee-projects/edit/${ep.EmployeeID}/${projectId}`);
    };

    const handleDelete = (ep) => {
        if (window.confirm(`Bạn có chắc muốn xoá nhân viên ${ep.UserName} khỏi dự án không?`)) {
            service.delete(ep.EmployeeID, id)
                .then(() => {
                    setEmployeeProjects(employeeProjects.filter(item =>
                        !(item.EmployeeID === ep.EmployeeID)
                    ));
                });
        }
    };

    return (
        <div style={{ padding: "80px 20px" }}>
            <Grid>
                <Grid.Row columns={4}>
                    <Grid.Column>
                        <Input
                            icon="search"
                            placeholder="Tìm kiếm..."
                            fluid
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Dropdown
                            placeholder="Nhân viên"
                            fluid
                            selection
                            clearable
                            options={employees}
                            value={employeeId}
                            onChange={(e, { value }) => setEmployeeId(value || null)}
                        />
                    </Grid.Column>
                    {/*<Grid.Column>*/}
                    {/*    <Dropdown*/}
                    {/*        placeholder="Dự án"*/}
                    {/*        fluid*/}
                    {/*        selection*/}
                    {/*        clearable*/}
                    {/*        options={projects}*/}
                    {/*        value={projectId}*/}
                    {/*        onChange={(e, { value }) => setProjectId(value || null)}*/}
                    {/*    />*/}
                    {/*</Grid.Column>*/}
                    <Grid.Column textAlign="right">
                        <Button
                            content="Thêm"
                            color="green"
                            icon="plus"
                            onClick={goToAdd}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <br />

            <Table celled striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>#</Table.HeaderCell>
                        <Table.HeaderCell>Nhân viên</Table.HeaderCell>
                        <Table.HeaderCell>Dự án</Table.HeaderCell>
                        <Table.HeaderCell>Vai trò</Table.HeaderCell>
                        <Table.HeaderCell>Hành động</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {employeeProjects.length > 0 ? (
                        employeeProjects.map((ep, index) => (
                            <Table.Row key={`${ep.UserName}-${ep.ProjectName}-${index}`}>
                                <Table.Cell>{(currentPage - 1) * pageSize + index + 1}</Table.Cell>
                                <Table.Cell>{ep.UserName}</Table.Cell>
                                <Table.Cell>{ep.ProjectName}</Table.Cell>
                                <Table.Cell>{ep.RoleInProject || "-"}</Table.Cell>
                                <Table.Cell>
                                    <Button
                                        icon="edit"
                                        basic
                                        size="tiny"
                                        onClick={() => goToEdit(ep)}
                                    />
                                    <Button
                                        icon="trash"
                                        color="red"
                                        size="tiny"
                                        onClick={() => handleDelete(ep)}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan="5">Không có dữ liệu.</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />
            </div>
        </div>
    );
}
