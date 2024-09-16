import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import Widget from "../../Components/widget/Widget";
import Featured from "../../Components/featured/Featured";
import Chart from "../../Components/chart/Chart";
import Table from "../../Components/table/Table";
import "../../home.scss";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { getAllUsers } from "../../Redux/Actions/authActions";
import { createCategoryList } from "../../utils/functions";

const AdminPanel = () => {
  const dispatch = useDispatch()
  useEffect( async () => {
    dispatch(getAllUsers())
    }, [])

  const {users} = useSelector(state=> state.users)
  const {posts} = useSelector(state=> state.posts)
  const {questions} = useSelector(state=> state.questions)
  const {categories} = useSelector(state=> state.categories)
  const categoriesList = createCategoryList(categories)

  

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" amount ={users.length} />
          <Widget type="category" amount={categoriesList.length} />
          <Widget type="posts" amount={posts.length + questions.length} />
          <Widget type="likes" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Engagement)" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;