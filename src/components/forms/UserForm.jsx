import { Form, Input, Select } from "antd"
import "../../styles/forms/userForm.css"
import { createUser, editUser, handleModalEdit } from "../../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import useRedux from "../../hooks/redux/useRedux";
import { useEffect } from "react";


function UserForm({ editionMode = false }) {


    const [form] = Form.useForm();

    const {
        dispatch,
        selector: {
            loadings: { isCreating, isEditing },
            currentUser
        } } = useRedux(state => state.users);

    useEffect(() => {
        const getInitialValues = () => {
            if (editionMode) {
                return {
                    ...currentUser,
                    priority: currentUser?.priority?.toString()
                };
            } else {
                return {
                    fullname: '',
                    linkedin: '',
                    annotations: '',
                    priority: ''
                }
            }
        }

        form.setFieldsValue(getInitialValues());

    }, [currentUser]);

    const navigate = useNavigate();

    const handleCreate = async (data) => {
        await dispatch(createUser({
            ...data,
            priority: parseInt(data.priority),
            createdAt: Date.now()
        })).unwrap();

        navigate('/');
    }

    const handleEdit = async (data) => {

        await dispatch(editUser({ ...data, id: currentUser.id, priority: parseInt(data.priority) })).unwrap();
        dispatch(handleModalEdit());
    }

    const onFinish = (data) => {
        if (editionMode) {
            handleEdit(data);
        } else {
            handleCreate(data);
        }
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={`userForm ${editionMode ? '' : 'userForm--border'}`}
        >
            <Form.Item
                name="fullname"
                label="FullName"
                rules={[{ required: true, type: 'string', message: 'FullName is required' }, { min: 4, max: 30 }]}

            >
                <Input placeholder="Person's full name" />
            </Form.Item>
            <Form.Item
                name="linkedin"
                label="LinkedIn URL"
                rules={[
                    {
                        required: true,
                        pattern: new RegExp("^(https://www.linkedin.com/in/).+$"),
                        message: "Invalid URL"
                    }
                ]}

            >
                <Input placeholder="ex: https://www.linkedin.com/in/user1" />
            </Form.Item>
            <Form.Item
                name="annotations"
                label="Annotations"
                rules={[{ required: false, type: 'string', max: 200 }]}

            >
                <Input.TextArea
                    placeholder="Personal annotations about the person"
                    autoSize={{ minRows: 3, maxRows: 7 }} />
            </Form.Item>
            <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true }]}
            >
                <Select placeholder="Select a priority">
                    <Select.Option value="1">Low</Select.Option>
                    <Select.Option value="2">Medium</Select.Option>
                    <Select.Option value="3">High</Select.Option>
                </Select>
            </Form.Item>

            <button
                className={`submit-button ${isCreating || isEditing ? 'submit-button--disabled' : 'submit-button--active'}`}
                type="submit"
                disabled={isCreating || isEditing}
            >
                {editionMode ? 'Save Changes' : 'Add a Linkedin'}
            </button>


        </Form>
    )
}

export default UserForm