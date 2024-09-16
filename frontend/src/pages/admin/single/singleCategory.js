import "./single.scss";
import Sidebar from "../../../Components/sidebar/Sidebar";
import Navbar from "../../../Components/navbar/Navbar";
import Chart from "../../../Components/chart/Chart";
import List from "../../../Components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../Redux/Actions/authActions";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, ChakraProvider } from "@chakra-ui/react";
import { CircularProgress } from "@mui/material";
import { useContext } from "react";
import { HomeContext } from "../../../Context/HomeContext";
import axios from "axios";

const SingleCategory = () => {
    const{t} = useContext(HomeContext)
    const dispatch = useDispatch()
    const [form, setForm] = useState({});
    const { id } = useParams();
    const {users} = useSelector(state => state.users)
    const Followers = users.filter(user => form?.Followers?.includes(user._id))
    console.log(form)
    console.log(Followers)



    useEffect(async () => {
      dispatch(getAllUsers())
      await axios.get(`/Api/categories/${id}`)
          .then((res) => {
              setForm(res.data);
          });
  }, []);
    
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">

        </div>
        <div className="bottom">
        <h1 className="title">Last Transactions</h1>
          <List/>
        </div>
      </div>
    </div>
  );
};

export default SingleCategory;