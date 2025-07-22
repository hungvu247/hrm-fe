import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Container, Form} from "semantic-ui-react";
import Headline from "../../layouts/Headline";
import EmployeeProjectService from "../../services/employeeProjectService";

export default function EmployeeProjectEdit() {
    const { employeeId, projectId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    const employeeProjectService = new EmployeeProjectService();

    useEffect(() => {
        employeeProjectService.getToEdit(employeeId, projectId)
            .then(res => {
                console.log(res)
                const data = res.data;
                setInitialData(data);
                formik.setValues({
                    RoleInProject: data.roleInProject || "",
                });
            })
            .catch(() => console.log("Lỗi"));
    }, [employeeId, projectId]);

    const validationSchema = Yup.object({
        RoleInProject: Yup.string().required("Role in project is required"),
    });

    const handleSubmit = (values) => {
        console.log("check value" + values);
        const dto = {
            EmployeeId: employeeId,
            ProjectId: projectId,
            RoleInProject: values.RoleInProject,
        };
        employeeProjectService.update(dto)
            .then(() => {

                navigate(`/dashboard/employee-projects/${projectId}`);
            })
            .catch(() => console.log("Lỗi"));
    };

    const formik = useFormik({
        initialValues: {
            RoleInProject: "",
        },
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true, // cần để setValues hoạt động
    });

    if (!initialData) return <div>Loading...</div>;

    return (
        <Container className="content">
            <Headline content="Edit Employee in Project" />
            <Form onSubmit={formik.handleSubmit}>
                <Form.Input
                    label="Employee"
                    value={initialData.userName}
                    readOnly
                />

                <Form.Input
                    label="Project"
                    value={initialData.projectName}
                    readOnly
                />

                <Form.Input
                    label="Role In Project"
                    name="RoleInProject"
                    value={formik.values.RoleInProject}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.RoleInProject && formik.errors.RoleInProject
                            ? { content: formik.errors.RoleInProject }
                            : null
                    }
                />

                <Button type="submit" color="blue" content="Update" fluid />
            </Form>
        </Container>
    );
}
