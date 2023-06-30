import "../styles/table/table.css";
import { Table, Space } from "antd"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { handleModalAlert, handleModalEdit, handleModalDetails, setSelectedUsers } from "../features/users/userSlice";
import { priorities } from "../helpers/mapping.js";
import useRedux from "../hooks/redux/useRedux";


function MyTable({ datasource }) {

    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelected, setIsSelected] = useState(false);

    const { dispatch, selector: { selectedUsers } } = useRedux(state => state.users);

    useEffect(() => {
        const checkSelection = () => {
            if (selectedRows.length > 0) {
                setIsSelected(true);
            } else {
                setIsSelected(false);
            }
        }
        checkSelection();
    }, [selectedRows]);

    useEffect(() => {
        if(selectedUsers.length === 0) setSelectedRows([]);
    }, [selectedUsers]);


    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRows(newSelectedRowKeys);
    }

    const rowSelection = {
        selectedRows,
        onChange: onSelectChange

    }

    const handleDelete = (user) => {
        dispatch(setSelectedUsers([user.id]));
        dispatch(handleModalAlert());
    }

    const handleEdit = (user) => {
        dispatch(handleModalEdit(user));
    }

    const handleDetails = (user) => {
        dispatch(handleModalDetails(user));
    }

    const handleMultipleDelete = () => {
        dispatch(setSelectedUsers(selectedRows));
        dispatch(handleModalAlert());
    }


    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname)
        },
        {
            title: 'LinkedIn',
            dataIndex: '',
            key: 'linkedin',
            responsive: ['md'],
            render: (dataIndex) => {
                return (
                    <Link
                        className="table__link"
                        to={dataIndex.linkedin}
                        target="_blank"
                    >
                        {dataIndex.linkedin}
                    </Link>
                )
            }
        },
        {
            title: 'Annotations',
            dataIndex: 'annotations',
            key: 'annotations',
            responsive: ['lg']
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            responsive: ['md'],
            sorter: (a, b) => a.priority - b.priority,
            render: (priority) => {
                return (
                    <p className={`priority ${priority === 1 ? 'priority-low' : priority === 2 ? 'priority-medium' : 'priority-high'}`}>{priorities[priority]}</p>
                )
            }
        },
        {
            title: 'Actions',
            dataIndex: '',
            render: (dataIndex) => {
                return (
                    <Space className="table__content-actionPanel">
                        <button
                            type="button"
                            className="table__content-button table__content-button--view"
                            onClick={() => handleDetails(dataIndex)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="table-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="table__content-button"
                            onClick={() => handleEdit(dataIndex)}

                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="table-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="table__content-button"
                            onClick={() => handleDelete(dataIndex)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="table-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </Space>
                )
            }
        }
    ]
    return (
        <div className="table__content">
            {
                <div className="table__content-panel">
                    <button
                        className={`table__content-deleteButton ${isSelected ? 'table__content-deleteButton--active' : ''}`}
                        disabled={!isSelected}
                        onClick={handleMultipleDelete}

                    >
                        Delete All Selected
                    </button>
                </div>
            }

            <Table columns={columns} dataSource={datasource} rowSelection={rowSelection} rowKey={(data) => data.id} pagination={{ position: ['bottomCenter'] }} />
        </div>

    )
}

export default MyTable