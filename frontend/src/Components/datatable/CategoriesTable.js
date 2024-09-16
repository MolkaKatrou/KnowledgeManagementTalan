import "./datatable.scss";
import {   GridColumns,
    GridRowsProp,
    DataGrid,
    GridCellEditStopParams,
    GridCellEditStopReasons,
    MuiEvent, } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IconButton, InputBase, Paper } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import toast from "react-hot-toast";
import { createCategoryList } from "../../utils/functions";
import { Avatar, ChakraProvider } from "@chakra-ui/react";
import { Box } from "@material-ui/core";
import Moment from 'react-moment';
import { getAllCategories } from "../../Redux/Actions/categoryAction";
import { getAllPosts } from "../../Redux/Actions/postsActions";
import { getAllQuestions } from "../../Redux/Actions/questionsActions";
import { Confirm } from "semantic-ui-react";
import { useContext } from "react";
import { HomeContext } from "../../Context/HomeContext";

const CategoriesTable = () => {
    const dispatch = useDispatch()
    const [categories, setCategories] = useState([]);
    const [show, setShow] = useState(false);
    const {posts} = useSelector(state=>state.posts)
    const {questions} = useSelector(state=>state.questions)
    const [open, setOpen]=useState(false)
    const [deleteId, setdeleteId]=useState('')
    const category = categories?.find(u=>u.value===deleteId)
    const {t}=useContext(HomeContext)



    useEffect(async () => {
        dispatch(getAllQuestions())
        dispatch(getAllPosts())
        await axios.get("/Api/categories")
            .then((res) => {
                setCategories(createCategoryList(res.data))
            });
    }, [show]);

    const filterContent = (categories, searchTerm) => {
        const result = categories.filter(
            (cat) =>
                cat.name.toLowerCase().includes(searchTerm) ||
                cat.color.toLowerCase().includes(searchTerm) ||
                cat.createdby.fullname.toLowerCase().includes(searchTerm) 
        );
        setCategories(createCategoryList(result));
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const searchTerm = e.target.value;
        axios.get("/Api/categories")
            .then(res => {
                filterContent(res.data, searchTerm);

            });
    };

    const categoryColumns = [
        {
            field: "name",
            headerName: "Category Name",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        <div className="mx-3">{params.row.name}</div>

                    </div>
                );
            },
        },
        {
            field: "createdby",
            headerName: "Creator",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        <ChakraProvider>
                            <Avatar src={params.row.createdby.pic} name={params.row.createdby.fullname} size='sm'></Avatar>
                        </ChakraProvider>
                        <div className="mx-3">{params.row.createdby.fullname}</div>

                    </div>
                );
            },
        },
        {
            field: "parentId",
            headerName: "Parent Category",
            width: 130,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.parentId}`}>
                        {categories.filter(cat => cat.value == params.row.parentId).map(obj => { return obj.name })}
                    </div>
                );
            },
        },

        {
            field: "color",
            headerName: "Color",
            width: 70,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.color}`}>
                        <Box style={{ backgroundColor: `${params.row.color}`, width: '30px', height: '10px' }}></Box>

                    </div>
                );
            },
        },

        {
            field: "followers",
            headerName: "Followers",
            width: 80,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.followers}`}>
                        {params.row.followers.length}

                    </div>
                );
            },
        },

        {
            field: "_id",
            headerName: "Posts",
            width: 80,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.value}`}>
                    <div>{posts.filter(p => p.category._id ===params.row.value).length}</div>  

                    </div>
                );
            },
        },

        {
            field: "value",
            headerName: "Questions",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.value}`}>
                    <div>{questions.filter(p => p.category._id ===params.row.value).length}</div>  

                    </div>
                );
            },
        },




    

        {
            field: "createdAt",
            headerName: "Created On",
            width: 120,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.createdAt}`}>

                        <Moment format="YYYY/MM/DD">
                            {params.row.createdAt}
                        </Moment>

                    </div>
                );
            },
        },



    ];

    const handleDelete = () => {
            axios.delete(`/Api/categories/${deleteId}`)
                .then(res => {
                    setShow(!show)
                    setOpen(false)
                    setTimeout(() => {
                        toast.success('The Category has been successfully deleted')
                    }, 2000);
                })
        
    }

  
    const ConfirmDelete = (id) => {
      setOpen(true)
      setdeleteId(id)
  }
  

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        {/*<Link to={`/categories/${params.row.value}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                </Link>*/}
                        <Link to={`/categories/update/${params.row.value}`} style={{ textDecoration: "none" }}>
                            <div className="UpdateButton">Update</div>
                        </Link>

                        <div
                            className="deleteButton"
                            onClick={() => ConfirmDelete(params.row.value)}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                <Link to="/categories/new" className="link">
                    Add New Category
                </Link>
                <Paper
                    sx={{ p: '1px 1px', display: 'flex', alignItems: 'center', width: 400, bgcolor: 'transparent' }}
                    style={{ borderRadius: '18px', border: '1px solid #DDD4D4' }}
                    className='Search-admin'
                >
                    <IconButton>
                        <SearchIcon className='Search-admin' />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search.."
                        className='Search-admin'
                        onChange={handleSearch}
                        inputProps={{ 'aria-label': 'search ' }}
                    />

                </Paper>
            </div>
            {categories ?
                <DataGrid
                    getRowId={(row) => row.value}
                    className="datagrid"
                    rows={categories}
                    columns={categoryColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection

                /> :

                <DataGrid
                    getRowId={(row) => row.value}
                    className="datagrid"
                    columns={categoryColumns.concat(actionColumn)}
                    loading='true'
                />
            }

<Confirm
        confirmButton={t("Delete The Category")}
        cancelButton={t('Cancel')}
        content={`${t('Are you sure you want to delete the category : ' )} ${category?.name}`}
        open={open}
        onCancel={() => { setOpen(false) }}
        onConfirm={handleDelete}
        style={{ height: '19%', overflow:'hidden' }}
      />
        </div>
    );
};

export default CategoriesTable;
