import "../styles/home/home.css"
import { useEffect } from "react"
import MyTable from "../components/table/MyTable"
import { getUsers } from "../features/users/userSlice";
import useRedux from "../hooks/redux/useRedux";
import ConfirmationModal from "../components/modal/ConfirmationModal";
import UserEditionModal from "../components/modal/UserEditionModal";
import UserDetailsModal from "../components/modal/UserDetailsModal";
import Spinner from "../components/auxiliary/Spinner";
import { Link } from "react-router-dom";
import UserSearcher from "../components/search/UserSearcher";

function Home() {

  const { dispatch, selector: { searchedUsers, loadings: { isFetchingUsers } } } = useRedux(state => state.users);

  useEffect(() => {

    if (searchedUsers.length === 0) {
      dispatch(getUsers());
    }

  }, []);

  return (
    <div className="container">
      {
        isFetchingUsers
          ?
          <Spinner />
          :
          searchedUsers.length > 0
            ?
            <>
              <UserSearcher />
              <MyTable datasource={searchedUsers} />
            </>
            :
            <div className="empty">
              <p className="empty__paragraph">You don't have any users yet, <Link to="/new">create one</Link> to get started.</p>
              <img
                className="empty__img"
                src="/assets/img/not_found.png"
                alt="not found icon"
                width={100}
                height={100} />
            </div>

      }
      <UserEditionModal />
      <ConfirmationModal />
      <UserDetailsModal />
    </div>

  )
}

export default Home