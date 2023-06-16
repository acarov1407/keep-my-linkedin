import "../styles/home/home.css"
import { useEffect } from "react"
import MyTable from "../components/MyTable"
import { getUsers } from "../features/users/userSlice";
import useRedux from "../hooks/redux/useRedux";
import ConfirmationModal from "../components/modal/ConfirmationModal";
import UserEditionModal from "../components/modal/UserEditionModal";
import Spinner from "../components/auxiliary/Spinner";
import { Link } from "react-router-dom";


function Index() {


  const { dispatch, selector: { users, loadings: { isFetchingUsers } } } = useRedux(state => state.users);

  useEffect(() => {

    const checkUsers = () => {
      const users = JSON.parse(localStorage.getItem('users'));
      if(!users) {
        localStorage.setItem('users', JSON.stringify([]));
        return;
      }

      dispatch(getUsers());
    }

    checkUsers();



  }, []);


  const contacts = [
    {
      id: 1,
      fullname: "John Smith",
      linkedin: "https://www.linkedin.com/in/johnsmith",
      annotations: "Experienced marketing professional with strong leadership skills.",
      priority: 2
    },
    {
      id: 2,
      fullname: "Emily Johnson",
      linkedin: "https://www.linkedin.com/in/emilyjohnson",
      annotations: "Software engineer specialized in web development.",
      priority: 1
    },
    {
      id: 3,
      fullname: "Michael Davis",
      linkedin: "https://www.linkedin.com/in/michaeldavis",
      annotations: "Sales manager with a proven track record of exceeding targets.",
      priority: 3
    },
    {
      id: 4,
      fullname: "Sarah Thompson",
      linkedin: "https://www.linkedin.com/in/sarahthompson",
      annotations: "Graphic designer with a keen eye for detail.",
      priority: 2
    },
    {
      id: 5,
      fullname: "David Wilson",
      linkedin: "https://www.linkedin.com/in/davidwilson",
      annotations: "Financial analyst skilled in data analysis and forecasting.",
      priority: 1
    },
    {
      id: 6,
      fullname: "Jennifer Brown",
      linkedin: "https://www.linkedin.com/in/jenniferbrown",
      annotations: "Human resources specialist experienced in talent acquisition.",
      priority: 2
    },
    {
      id: 7,
      fullname: "Robert Anderson",
      linkedin: "https://www.linkedin.com/in/robertanderson",
      annotations: "Project manager with expertise in agile methodologies.",
      priority: 3
    },
    {
      id: 8,
      fullname: "Olivia Martinez",
      linkedin: "https://www.linkedin.com/in/oliviamartinez",
      annotations: "Marketing coordinator with a strong background in social media.",
      priority: 1
    },
    {
      id: 9,
      fullname: "Daniel Thomas",
      linkedin: "https://www.linkedin.com/in/danielthomas",
      annotations: "Experienced accountant proficient in financial analysis.",
      priority: 2
    },
    {
      id: 10,
      fullname: "Sophia Walker",
      linkedin: "https://www.linkedin.com/in/sophiawalker",
      annotations: "UX/UI designer passionate about creating intuitive user experiences.",
      priority: 3
    }
  ];




  return (
    <div className="container">
      {
        isFetchingUsers
          ?
          <Spinner />
          :
          users.length > 0
            ?
            <>
              <MyTable datasource={users} />
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('users', JSON.stringify(contacts))
                }}
              >
                Add
              </button>
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
    </div>

  )
}

export default Index