import { Modal } from "antd"
import useRedux from "../../hooks/redux/useRedux"
import { deleteUsers, handleModalAlert } from "../../features/users/userSlice";


function ConfirmationModal() {

    const {
        dispatch,
        selector: {
            modals,
            selectedUsers,
            loadings: { isDeleting }
        } } = useRedux(state => state.users);


    const handleOk = async () => {
        await dispatch(deleteUsers(selectedUsers)).unwrap();
        dispatch(handleModalAlert());

    }
    return (
        <Modal
            title="Delete User"
            open={modals.alert}
            okText="Yes"
            cancelText="Cancel"
            onOk={handleOk}
            confirmLoading={isDeleting}
            onCancel={() => dispatch(handleModalAlert())}
        >
            <p>Are you sure you want to delete {selectedUsers?.length} selected users?</p>
        </Modal>
    )
}

export default ConfirmationModal