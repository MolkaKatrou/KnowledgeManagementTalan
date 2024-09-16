import "../admin/new/new.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ChakraProvider } from '@chakra-ui/react';
import toast from "react-hot-toast";
import { ColorPicker } from "material-ui-color";
import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { getAllCategories } from "../../Redux/Actions/categoryAction";
import { useContext } from "react";
import { HomeContext } from "../../Context/HomeContext";
import { createCategoryList } from "../../utils/functions";


const CategoryDetails = ({ title }) => {
    const{t} = useContext(HomeContext)
    const dispatch= useDispatch()
    const {categories} = useSelector(state=> state.categories)
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoriesModal, setCategoriesModal] = useState([])



    function onChangeHandler(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    function onChangeHandler(e) {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
    

    useEffect(async () => {
        dispatch(getAllCategories())
        const c = createCategoryList(categories).filter(cat => cat.value !== id)
        setCategoriesModal(c)
        await axios.get(`/Api/categories/${id}`)
            .then((res) => {
                setForm(res.data);
            });
    }, []);

    const SubmitUpdate = () => {
        if (categoriesModal.find((c) => c.name.toLowerCase() === form.name.toLowerCase() && c.parentId === form.parentId)) {
          toast.error('This category already exists');
          return;
        }
        axios.put(`/Api/categories/${id}`, form)
        toast.success('Category successfully updated');
    
      }
    

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Update {form.name} Informations</h1>
                </div>
                <div className="col-md-6 offset-md-3 py-5 px-4 border shadow"  >
                    <div className="signup-form">
                        <form>
                            <div className="row">
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    name='name'
                                    fullWidth
                                    variant="standard"
                                    value={form.name}
                                    placeholder={t('Enter the category name')}
                                    onChange={onChangeHandler}
                                />


                                <FormControl sx={{ m: 0, minWidth: 250 }} className='mt-5'>
                                    <label style={{ fontWeight: 'bold' }}>Parent Category<span className="text-danger">*</span></label>
                            
                                    <Select      
                                        id="parentId"
                                        name='parentId'          
                                        value={form?.parentId}
                                        onChange={onChangeHandler}
                                        label={t("Parent Category")}
                                        className='mt-3'

                                    >
                                        <MenuItem value=''>
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            createCategoryList(categories.filter(cat => cat._id !== id)).map(option =>
                                                <MenuItem value={option.value}>{option.name}</MenuItem>
                                            )
                                        }

                                    </Select>
                                </FormControl>

                                <Box my={4}>
                                    <label style={{ fontWeight: 'bold' }}>Category Color<span className="text-danger mt-2">*</span></label>
                                    <ColorPicker className='mt-4' placeholder='Choose a color' value={form.color} onChange={onChangeHandler} />
                                </Box>

                                <ChakraProvider>
                                    <Button colorScheme='teal' className=' mt-4 mx-2' size='md' onClick={SubmitUpdate}>
                                        Update Category
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

export default CategoryDetails;