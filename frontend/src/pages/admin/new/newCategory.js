import "./new.scss";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from "../../../Components/sidebar/Sidebar";
import Navbar from "../../../Components/navbar/Navbar";
import { Box, FormControl, MenuItem, Select, TextField } from "@mui/material";
import { createCategoryList } from "../../../utils/functions";
import { ColorPicker, createColor } from "material-ui-color";
import { HomeContext } from "../../../Context/HomeContext";
import { createCategory, getAllCategories } from "../../../Redux/Actions/categoryAction";
import toast from "react-hot-toast";
import { DarkModeContext } from "../../../Context/darkModeContext";

const Categorynew = ({ title }) => {
    const { t } = useContext(HomeContext)
    const dispatch = useDispatch()
    const categoriesList = useSelector(state => state.categories)
    const [category, setCategory] = useState('')
    const [parentCategoryId, SetParentCategoryId] = useState('')
    const categoriesResult = categoriesList.categories
    const [color, setColor] = useState(createColor(""));
    const {darkMode} = useContext(DarkModeContext)

    const ChangeColor = (value) => {
        setColor(value);
    };
    const AddCategory = (e) => {
        e.preventDefault();
        const form = {
            name: category,
            parentId: parentCategoryId,
            color: "#" + color.hex
        }

        if (!category) {
            toast.error(t('Choose a category name'));
            return;
        }
        if (createCategoryList(categoriesResult).find((c) => c.name.toLowerCase() === category.toLowerCase())) {
            toast.error(t('This category already exists'));
            return;
        }

        dispatch(createCategory(form));
        toast.success(t('Category successfully created'));
        setCategory('')
        SetParentCategoryId('')
    }



    useEffect(async () => {
        dispatch(getAllCategories())
    }, []);


    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <form onSubmit={AddCategory}>
                        <div>
                            <label style={{ fontWeight: 'bold' }}>{t('Category')}<span className="text-danger">*</span></label>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                value={category}
                                placeholder={t('Enter the category name')}
                                onChange={(e) => { setCategory(e.target.value) }}
                                
                            />

                         
                            <FormControl sx={{ m: 0, minWidth: 250 }} className='mt-5'>
                            <label style={{ fontWeight: 'bold' }}>{t('Parent Category')}<span className="text-danger">*</span></label>
                                <Select
                                    value={parentCategoryId}
                                    onChange={(e) => { SetParentCategoryId(e.target.value) }}
                                    label={t("Parent Category")}
                                    className='mt-3 dark-input'

                                >
                                    <MenuItem className='dark'  value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        createCategoryList(categoriesList.categories).map(option =>
                                            <MenuItem className='dark' value={option.value}>{option.name}</MenuItem>
                                        )
                                    }

                                </Select>
                            </FormControl>
                            
                            <Box my={4} >
                            <label style={{ fontWeight: 'bold' }}>{t('Category Color')}<span className="text-danger mt-2">*</span></label>
                                <ColorPicker className='mt-4 dark-input dark' placeholder='Choose a color' value={color} onChange={ChangeColor} />
                            </Box>
                        </div>
                        <button className="btn btn-success mt-3" type="submit"> {t('Add Category')} </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Categorynew;