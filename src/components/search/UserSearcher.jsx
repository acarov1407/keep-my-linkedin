import "../../styles/forms/searchForm.css"
import { Input, Form } from "antd"
import useRedux from "../../hooks/redux/useRedux";
import { searchUser, clearSearch } from "../../features/users/userSlice";

function UserSearcher() {

    const [form] = Form.useForm();

    const { dispatch } = useRedux(state => state.users);

    const onFinish = ({ searchQuery }) => {
        dispatch(searchUser(searchQuery))
    }

    const handleClear = () => {
        dispatch(clearSearch());
        form.resetFields();
    }

    return (
        <Form
            className="searchForm"
            form={form}
            onFinish={onFinish}
        >
            <Form.Item
                name="searchQuery"
                className="mb"
            >
                <Input type="search" placeholder="Write a name to search..." />
            </Form.Item>

            <div className="searchForm__buttons">

                <button
                    className="searchForm__clear"
                    type="button"
                    onClick={handleClear}
                >
                    Clear
                </button>
                <button
                    className="searchForm__submit"
                    type="submit"
                >
                    Search User
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                </button>
            </div>

        </Form>
    )
}

export default UserSearcher