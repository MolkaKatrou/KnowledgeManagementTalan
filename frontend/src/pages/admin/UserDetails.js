import "../admin/new/new.scss";
import React, { useEffect, useState } from "react";
import AdminInput from "../../Components/inputs/AdminInput";
import AdminRoleOption from "../../Components/inputs/AdminRoleOption";
import axios from "axios";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import AdminUserInput from "../../Components/inputs/AdminUserInput";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ChakraProvider } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


const Details = ({ title }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth)


  function onChangeHandler(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios.patch(`/Api/users/${id}`, form)
      .then(res => {
        navigate('/users')
        toast.success(` ${form.fullname} informations have been successfully updated!`)
      })
      .catch(err => setErrors(err.response.data))

  }


  useEffect(async () => {
    await axios.get(`/Api/users/${id}`)
      .then((res) => {
        setForm(res.data);
      });
  }, []);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Update {form.fullname} Informations</h1>
        </div>
        <div className="col-md-6 offset-md-3 py-5 px-4 border shadow"  >
          <div className="signup-form">
            <form>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <AdminInput
                    label="Last Name"
                    type="text"
                    name="lastname"
                    onChangeHandler={onChangeHandler}
                    errors={errors.lastname}
                    value={form.lastname}
                    icon="fa fa-user"
                    onKeyDown={() => { delete errors.lastname }}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <AdminInput
                    label="First Name"
                    type="text"
                    name="firstname"
                    onChangeHandler={onChangeHandler}
                    errors={errors.firstname}
                    value={form.firstname}
                    icon="fa fa-user"
                    onKeyDown={() => { delete errors.firstname }}
                  />
                </div>


                <AdminInput
                  label="Email"
                  type="text"
                  name="email"
                  onChangeHandler={onChangeHandler}
                  errors={errors.email}
                  value={form.email}
                  icon="fa fa-envelope"
                  onKeyDown={() => { delete errors.email }}

                />


                <div className="mb-3 col-md-6">
                  <AdminInput
                    label="Username"
                    type="text"
                    name="username"
                    onChangeHandler={onChangeHandler}
                    errors={errors.username}
                    value={form.username}
                    icon="fa fa-user"
                    onKeyDown={() => { delete errors.username }}

                  />
                </div>
                <div className="mb-3 col-md-6">
                  <AdminInput
                    label="Phone Number"
                    type="text"
                    name="phone"
                    onChangeHandler={onChangeHandler}
                    errors={errors.phone}
                    value={form.phone}
                    icon="fa fa-phone"
                    onKeyDown={() => { delete errors.phone }}
                  />
                </div>

                <AdminInput
                  label="Adress"
                  type="text"
                  name="adress"
                  onChangeHandler={onChangeHandler}
                  errors={errors.adress}
                  value={form.adress}
                  icon="fa fa-home"
                  onKeyDown={() => { delete errors.adress }}
                />
                <div className={auth.user.id !== id ? `mb-3 col-md-6` : ''} >
                  <AdminRoleOption
                    label="occupation"
                    type="text"
                    name="occupation"
                    onChangeHandler={(e) => {
                      setForm({
                        ...form,
                        [e.target.name]: e.target.value,
                      });
                      delete errors.occupation
                    }}
                    errors={errors.occupation}
                    value={form.occupation}
                    icon="fa fa-briefcase"
                  />
                </div>
                {auth.user.id !== id ? (
                  <div className="mb-3 col-md-6">
                    <AdminUserInput
                      label="Role"
                      type="text"
                      name="role"
                      onChangeHandler={(e) => {
                        setForm({
                          ...form,
                          [e.target.name]: e.target.value,
                        });
                        delete errors.role
                      }}
                      errors={errors.role}
                      value={form.role}
                      icon="fa fa-briefcase"
                    />
                  </div>
                ) : ('')}

                <ChakraProvider>
                  <Button colorScheme='teal' className=' mt-4 mx-2' size='md' onClick={onSubmitHandler}>
                    Update Collaborator
                  </Button>
                </ChakraProvider>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;