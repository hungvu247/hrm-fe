import { useEffect, useState } from "react";
import {
    Button,
    Dropdown,
    Grid,
    Input,
    Table
} from "semantic-ui-react";
import EmployeeContactService from "../../services/employeeContactService";
import EmployeeService from "../../services/employeeService";
import PaginationControl from "../../layouts/Util/PaginationControl";
import {useNavigate} from "react-router-dom";

const contactTypeOptions = [
    { key: 'Email', text: 'Email', value: 'Email' },
    { key: 'Phone', text: 'Phone', value: 'Phone' },
    { key: 'Zalo', text: 'Zalo', value: 'Zalo' },
];

export default function EmployeeContactList() {
    const [search, setSearch] = useState("");
    const [employeeId, setEmployeeId] = useState();
    const [type, setType] = useState();

    const [employees, setEmployees] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const contactService = new EmployeeContactService();
    const navigate = useNavigate();

    // Lấy danh sách nhân viên cho dropdown lọc
    useEffect(() => {
        const employeeService = new EmployeeService();
        employeeService.getAll(1, 100, {}) // lấy tất cả nhân viên (hoặc limit lớn)
            .then(res => {
                const options = res.data.data.map(e => ({
                    key: e.employeeId,
                    text: `${e.firstName} ${e.lastName}`,
                    value: e.employeeId
                }));
                setEmployees(options);
            });
    }, []);

    // Gọi API lấy danh sách liên hệ
    useEffect(() => {
        const searchDto = {
            keyword: search,
            employeeId,
            type
        };
        contactService.getAll(currentPage, pageSize, searchDto)
            .then(res => {
                setContacts(res.data.data);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error("Lỗi khi lấy liên hệ:", err));
    }, [search, employeeId, type, currentPage, pageSize]);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xoá liên hệ này không?")) {
            contactService.deleteById(id).then(() => {
                setContacts(contacts.filter(c => c.ContactId !== id));
            });
        }
    };

    function goToAdd() {
        navigate("add")
    }

    const goToEdit = (contactId) => {
        navigate(`/dashboard/employee-contacts/edit/${contactId}`);
    };
    return (
        <div style={{ padding: "80px 20px" }}>
            <Grid>
                <Grid.Row columns={4}>
                    <Grid.Column>
                        <Input
                            icon="search"
                            placeholder="Tìm theo giá trị..."
                            fluid
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                            onChange={(e, { value }) => setEmployeeId(value)}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Dropdown
                            placeholder="Loại liên hệ"
                            fluid
                            selection
                            clearable
                            options={contactTypeOptions}
                            value={type}
                            onChange={(e, { value }) => setType(value)}
                        />
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <Button
                            content="Thêm liên hệ"
                            color="green"
                            icon="plus"
                            onClick={() => {
                                goToAdd()
                            }}
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
                        <Table.HeaderCell>Loại</Table.HeaderCell>
                        <Table.HeaderCell>Giá trị</Table.HeaderCell>
                        <Table.HeaderCell>Mặc định</Table.HeaderCell>
                        <Table.HeaderCell>Hành động</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {contacts.map((c, index) => (
                        <Table.Row key={c.ContactId}>
                            <Table.Cell>{(currentPage - 1) * pageSize + index + 1}</Table.Cell>
                            <Table.Cell>{c.employeeId}</Table.Cell>
                            <Table.Cell>{c.contactType}</Table.Cell>
                            <Table.Cell>{c.contactValue}</Table.Cell>
                            <Table.Cell>{c.isPrimary ? "✔️" : ""}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    icon="edit"
                                    basic
                                    size="tiny"
                                    onClick={() => {
                                        goToEdit(c.contactId)
                                    }}
                                />
                                <Button
                                    icon="trash"
                                    color="red"
                                    size="tiny"
                                    onClick={() => handleDelete(c.contactId)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
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
