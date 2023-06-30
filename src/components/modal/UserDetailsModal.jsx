import "../../styles/modals/userDetailsModal.css";
import { Modal, Button } from "antd";
import useRedux from "../../hooks/redux/useRedux"
import { handleModalDetails, setIsClosingModal } from "../../features/users/userSlice";
import { priorities } from "../../helpers/mapping.js";

function UserDetailsModal() {

    const { dispatch, selector: { modals, currentUser } } = useRedux(state => state.users);

    const handleOk = () => {
        dispatch(setIsClosingModal(true));
        dispatch(handleModalDetails());
        setTimeout(() => {
            dispatch(setIsClosingModal(false));
        }, 400);
    }

    return (
        <Modal
            title="User Details"
            open={modals.details}
            okText="Ok"
            onOk={handleOk}
            onCancel={handleOk}
            footer={[
                <Button
                    key="ok"
                    onClick={handleOk}
                    type="primary"
                >
                    Ok
                </Button>
            ]}
        >
            <div className="userDetailsModal__container">
                <div className="userDetailsModal__field">
                    <p className="userDetailsModal__field-label">FullName</p>
                    <p>{currentUser?.fullname}</p>
                </div>
                <div className="userDetailsModal__field">
                    <p className="userDetailsModal__field-label">Linkedin</p>
                    <a href={currentUser?.linkedin} target="_blank" rel="noreferrer">{currentUser?.linkedin}</a>
                </div>
                <div className="userDetailsModal__field">
                    <p className="userDetailsModal__field-label">Annotations</p>
                    <p>{currentUser?.annotations}</p>
                </div>
                <div className="userDetailsModal__field">
                    <p className="userDetailsModal__field-label">Priority</p>
                    <p className={`priority priority--modal ${currentUser?.priority === 1 ? 'priority-low' : currentUser?.priority === 2 ? 'priority-medium' : 'priority-high'}`}>
                        {priorities[currentUser?.priority]}
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default UserDetailsModal