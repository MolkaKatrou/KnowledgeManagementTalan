import "./single.scss";
import Sidebar from "../../../Components/sidebar/Sidebar";
import Navbar from "../../../Components/navbar/Navbar";
import Chart from "../../../Components/chart/Chart";
import List from "../../../Components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../Redux/Actions/authActions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Avatar, ChakraProvider } from "@chakra-ui/react";
import { CircularProgress } from "@mui/material";
import { getAllPosts } from "../../../Redux/Actions/postsActions";
import { getAllAnswers, getAllQuestions } from "../../../Redux/Actions/questionsActions";
import QuestionsTable from "../../../Components/table/QuestionsTable";

const Single = () => {
  const { id } = useParams();
  const {users, loading} = useSelector(state => state.users)
  const {posts} = useSelector(state => state.posts)
  const {questions} = useSelector(state => state.questions)
  const {answers} = useSelector(state => state.answers)
  const userAnswers = answers.filter(p => p.createdby._id === id)
  const userQuestions = questions.filter(p => p.createdby._id === id)
  const userPosts = posts.filter(p => p.createdby._id === id)
  const user = useSelector((state) => users?.find((u) => u?._id === id));

  const dispatch = useDispatch()

  useEffect( async () => {
    dispatch(getAllAnswers())
    dispatch(getAllQuestions())
  dispatch(getAllPosts())  
  dispatch(getAllUsers())
  }, [])
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to={`/users/update/${id}`}>
            <div className="editButton">Edit</div>
            </Link>
            <h1 className="title">Information</h1>
            {loading ?

< CircularProgress size="3em" elevation={4}  />
:
            <div className="item">

              <ChakraProvider>
                <Avatar src={user.pic} name={user.fullname} size='lg'></Avatar>
              </ChakraProvider>
              <div className="details">
                <h1 className="itemTitle" style={{fontWeight:'600', fontSize:'18px'}}>{user.fullname}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Username:</span>
                  <span className="itemValue">{user.username}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                  {user.adress}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Occupation:</span>
                  <span className="itemValue">{user.occupation}</span>
                </div>
              </div>
            </div> }
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Activity ( Last 6 Months)" id={id} />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Last Notes</h1>
          <List rows={userPosts}/>
        </div>
        <div className="bottom">
        <h1 className="title">Last Questions</h1>
          <QuestionsTable rows={userQuestions} answers={answers}/>
        </div>
      </div>
    </div>
  );
};

export default Single;
