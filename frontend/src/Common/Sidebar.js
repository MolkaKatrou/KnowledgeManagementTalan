import React, { useEffect, useState, useContext } from 'react';
import { Box, List, ListItem, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, makeStyles, MenuItem, Select, TextField, Typography } from "@material-ui/core"
import Home from '@mui/icons-material/Home';
import Bookmark from '@mui/icons-material/Bookmarks';
import AdminPanel from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/LayersSharp';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from 'react-redux'
import { createCategory, getAllCategories } from '../Redux/Actions/categoryAction';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Draft from '@mui/icons-material/StickyNote2';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TreeView from '@mui/lab/TreeView';
import StyledTreeItem from '../Components/StyledTreeItem'
import { NavLink, useNavigate } from 'react-router-dom';
import { ColorPicker, createColor } from "material-ui-color";
import { Alert, InputBase } from '@mui/material';
import { CategoryContext } from '../Context/CategoryContext';
import { createCategoryList } from '../utils/functions';
import { Confirm } from 'semantic-ui-react';
import { HomeContext } from '../Context/HomeContext';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChakraProvider } from '@chakra-ui/react';



const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    overflowX:'hidden',
    overflowY: 'auto',
    background: 'rgb(225, 228, 232)',
    boxShadowRight: '0 5px 2px #8084ac',
    paddingTop: theme.spacing(7),
    position: '-webkit-sticky',
    position: 'sticky',
    top: 0,
    [theme.breakpoints.up("sm")]: {
      borderRight: "1px solid #8084ac",
    },
  },
  item: {
    color: 'rgb(82, 82, 82)',
    fontWeight:600,
    fontSize:'13px',
    textDecoration: 'none',
    padding: theme.spacing(1.3),
    "&.active": {
      background:'rgba(120, 133, 150, 0.170)',     
    },
    '&:hover': {
      backgroundColor: 'rgba(120, 133, 150, 0.170)',
      textDecorationStyle: 'none',
      color:'rgb(82, 82, 82)',
    },

    marginBottom: theme.spacing(0),
    [theme.breakpoints.up("xs")]: {
      cursor: "pointer",
    },
  },

  itemCategory: {
    cursor:'default',
    color: 'rgb(82, 82, 82)',
    fontWeight:600,
    fontSize:'13px',
    textDecoration: 'none',
    padding: theme.spacing(1.3),
    marginBottom: theme.spacing(0),
  },


  list: {
    color: '#888',
    marginTop: '-10px',
    marginLeft: '-5px',
    float: 'left',
    margin: '10px px 0 0'
  },

  icon: {
    color: '#8084ac',
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      fontSize: "18px",
    },
  },
  iconCategory: {
    cursor:'pointer',
    color: '#8084ac',
    width:'20px',
    '&:hover': {
      color: '#484B75',
    },
  },
  text: {
    fontSize:'13px',
    color: '0000008A',
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: '12px'
    },
  },

  textCategory: {
    fontWeight: '540',
    [theme.breakpoints.down("sm")]: {
      display: "none",

    },
  },

  dialogWrapper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  dialogTitle: {
    paddingRight: '0px'
  },

  checkbox: {
    display: "none",
    color: 'red'
  },
}));




const Sidebar = ({ user }) => {
  const {categoryId, setCategoryId, updateCategory, setUpdateCategory } = useContext(CategoryContext)
  const {t} = useContext(HomeContext)
  const navigate = useNavigate()
  const classes = useStyles()
  const dispatch = useDispatch()
  const [parentCategoryIdName, setParentCategoryIdName] = useState('')
  const [categoryIdName, setCategoryIdName] = useState('')
  const [newColor, setNewColor] = useState(createColor(""));
  const categoriesList = useSelector(state => state.categories)
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [expanded, setExpanded] = useState([])
  const [category, setCategory] = useState('')
  const categoriesResult = categoriesList.categories
  const [categories, setCategories] = useState(categoriesList.categories);
  const [parentCategoryId, SetParentCategoryId] = useState('')
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState([])
  const [color, setColor] = useState(createColor(""));
  const [submitUpdate, setSubmitUpdate] = useState(false)
  const currentCategory = useSelector((state) => (categoryId ? createCategoryList(categoriesResult).find((c) => c.value === categoryId) : null));
  const [categoriesModal, setCategoriesModal] = useState([])

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setCategory('');
    SetParentCategoryId('');
    setColor(createColor(''))
  }


  useEffect( async () => {
    dispatch(getAllCategories())
    await axios.get(`/Api/categories`)
    .then((res) => {
        setCategories(res.data);
    });
    if (currentCategory) {
      setCategoryIdName(currentCategory?.name);
      setParentCategoryIdName(currentCategory?.parentId);
      setNewColor(currentCategory?.color);

      const c = createCategoryList(categoriesList.categories).filter(cat => cat.value !== categoryId)
      setCategoriesModal(c)
    }
  }, [dispatch, show, openDelete, updateCategory])


  const ChangeColor = (value) => {
    setColor(value);
  };

  const ChangeNewColor = (value) => {
     setNewColor(value);
  };

  const handleToggle = (event, nodeIds) => {
    event.persist()
    let iconClicked = event.target.closest(".MuiTreeItem-iconContainer")
    if (iconClicked) {
      setExpanded(nodeIds);
    }
  };

  //only select if icon wasn't clicked
  const handleSelect = (event, accountId) => {
    event.persist()
    let iconClicked = event.target.closest(".MuiTreeItem-iconContainer")
    if (!iconClicked) {
      setSelected(accountId);
    }
  };

  const filterContent = (categories, searchTerm) => {
    const result = categories.filter(
        (cat) =>
            cat.name.toLowerCase().includes(searchTerm) ||
            cat.color.toLowerCase().includes(searchTerm) ||
            cat.createdby.fullname.toLowerCase().includes(searchTerm) 
    );
    setCategories(result);
}

const handleSearch = (e) => {
    e.preventDefault()
    const searchTerm = e.target.value;
    axios.get("/Api/categories")
        .then(res => {
            filterContent(res.data, searchTerm);

        });
};



  const DeleteCategory = (Id) => {
    setOpenDelete(true)
    setCategoryId(Id);
  }

  const SubmitDelete = async () => {
    axios.delete(`/Api/categories/${categoryId}`)
    setOpenDelete(false)
    toast.success('Category successfully deleted');

  }


  const Clear = () => {
    setUpdateCategory(false)
    setCategoryIdName('')
    setParentCategoryIdName('')
    setSubmitUpdate('')
  }

  const UpdateCategory = async (Id) => {
    setCategoryId(Id);
    setUpdateCategory(true);
  }

  const SubmitUpdate = () => {
    const form = {
      name: categoryIdName,
      parentId: parentCategoryIdName,
      color: "#" + newColor.hex
    }
    if (!categoryIdName) {
      toast.error('Choose a new category name');
      return;
    }
    if (categoriesModal.find((c) => c.name.toLowerCase() === categoryIdName.toLowerCase() && c.parentId === parentCategoryIdName)) {
      toast.error('This category already exists');
      return;
    }
    axios.patch(`/Api/categories/${categoryId}`, form)
    toast.success('Category successfully updated');
    Clear()

  }


  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push(
        <StyledTreeItem
          Id={category._id}
          createdby = {category.createdby}
          labelText={category.name}
          color="#a250f5"
          bgColor="#B8BFCA99"
          OnUpdate={UpdateCategory}
          OnDelete={DeleteCategory}
        >
          {category.children.length > 0 ? (renderCategories(category.children)) : null}
        </StyledTreeItem >

      );
    }
    return myCategories;

  }
  const items = renderCategories(categories)

  const AddCategory = (e) => {
    e.preventDefault();
    const form = {
      name: category,
      parentId: parentCategoryId,
      color: "#" + color.hex
    }

    if (!category) {
      toast.error('Choose a category name');
      return;
    }
    if (createCategoryList(categoriesResult).find((c) => c.name.toLowerCase() === category.toLowerCase())) {
      toast.error('This category already exists');
      return;
    }

    dispatch(createCategory(form));
    toast.success('Category successfully created');
    setShow(!show)
    setOpenAdd(false)
    setCategory('')
    SetParentCategoryId('')
  }



  return (
    <div className={`${classes.container} sidebar-background`} >

      <List>
        <ListItem component={NavLink} className={`${classes.item} item`} to='/Home'>
          <Home className={classes.icon} />
          <Typography className={classes.text} component={'div'}>
            {t('Home')}
          </Typography>
        </ListItem>


        <ListItem  component={NavLink} className={`${classes.item} item`} to='/Bookmarks'>
          <Bookmark className={classes.icon} />
          <Typography className={classes.text} component={'div'}>
            {t('Bookmarks')}
          </Typography>
        </ListItem>

        <ListItem  component={NavLink} className={`${classes.item} item`} to='/Drafts'>
          <Draft className={classes.icon} />
          <Typography className={classes.text} component={'div'}>
            {t('Drafts')}
          </Typography>
        </ListItem>

        {user.role === "ADMIN" ? (
          <ListItem component={NavLink} className={`${classes.item} item`} to='/users' onClick={() => navigate('/admin')}>
            <AdminPanel className={classes.icon} />
            <Typography className={classes.text} component={'div'}>
              {t('Admin Dashboard')}
            </Typography>
          </ListItem>
        ) : (
          ""
        )}
        <Divider className='mb-3' component="ul" />

        <ListItem className={`${classes.itemCategory}`}>
          <CategoryIcon className={classes.icon} />
          <Typography className={classes.textCategory} component={'div'}>
           {t('Categories')}
          </Typography>
          <AddIcon onClick={() => { setOpenAdd(true) }} className={`${classes.iconCategory} mx-2`}></AddIcon>
        </ListItem>
        <Box className='d-flex mx-2'>
        <IconButton >
          <SearchIcon style={{color:'gray'}} />
        </IconButton>
        <InputBase
          className={`mx-1 search`}
          placeholder={t("Search..")}
          onChange={handleSearch}
        />
      </Box>
      </List>
  
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeToggle={handleToggle}
        expanded={expanded}
        selected={selected}
        onNodeSelect={handleSelect}
      >

        {items.map((item, index) => (<Typography component={'div'} key={item._id}>{item}</Typography>))}

      </TreeView>

      {/*Add categories */}

      <Dialog open={openAdd} onClose={handleCloseAdd} className={classes.paper}>
        <div style={{ backgroundColor: '#E6E6E6' }}>
          <DialogTitle>{t('Add a new category or a subcategory')} </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={t("Category")}
              fullWidth
              variant="standard"
              value={category}
              placeholder={t('Enter the category name')}
              onChange={(e) => { setCategory(e.target.value) }}
            />


            <FormControl sx={{ m: 1, minWidth: 120 }} className='mt-4'>
              <Select
                value={parentCategoryId}
                onChange={(e) => { SetParentCategoryId(e.target.value) }}
                label={t("Category")}

              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {
                  createCategoryList(categoriesList.categories).map(option =>
                    <MenuItem value={option.value}>{option.name}</MenuItem>
                  )
                }

              </Select>
            </FormControl>

            <Box my={4}>
              <ColorPicker placeholder='Choose a color' value={color} onChange={ChangeColor} />
            </Box>

          </DialogContent>
          <DialogActions className='mt-2' style={{ paddingBottom: '21px', paddingLeft: '180px' }}>
            <Button onClick={() => { setOpenAdd(false) }} size="md" variant="outlined" color="secondary">{t('Cancel')}</Button>
            <Button onClick={AddCategory} size="md" variant="outlined" color="primary">{t('Add Category')}</Button>
          </DialogActions>
        </div>
      </Dialog>

      {/*Edit categories */}

      <Dialog
        open={updateCategory}
        onClose={() => { setUpdateCategory(false) }}
        size="lg"
      >
        <div style={{ backgroundColor: '#E6E6E6' }}>
          <DialogTitle >{t('Edit the category or a subcategory')} </DialogTitle>
          <DialogContent >
            <Row className='d-flex justify-content-between'>
              <Col >
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label={t("Category")}
                  fullWidth
                  variant="standard"
                  placeholder={t('Enter the category name')}
                  onChange={(e) => { setCategoryIdName(e.target.value) }}
                  value={categoryIdName}

                />
              </Col>
              <Col>

                <FormControl sx={{ m: 1, minWidth: 120 }} className='mt-4 form-control'>
                  <Select
                    value={parentCategoryIdName}
                    onChange={(e) => { setParentCategoryIdName(e.target.value) }}
                    label="Category"

                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {
                      categoriesModal.map(option =>
                        <MenuItem value={option.value}>{option.name}</MenuItem>
                      )
                    }

                  </Select>
                </FormControl>
              </Col>
            </Row>
            <Box my={4}>
              <ColorPicker placeholder='Choose a color' value={newColor} onChange={ChangeNewColor} />
            </Box>


          </DialogContent>

          <DialogActions className='mt-2' style={{ paddingBottom: '21px', paddingLeft: '180px' }}>
            <Button onClick={() => { setUpdateCategory(false) }} variant="outlined" color="secondary" >{t('Cancel')}</Button>
            <Button onClick={SubmitUpdate} variant="outlined" color="primary" >{t('Update Category')}</Button>
          </DialogActions>
        </div>
      </Dialog>
      <Confirm
        confirmButton={t("Delete Category")}
        cancelButton={t('Cancel')}
        content={t('Are you sure you want to delete this category?')}
        open={openDelete}
        onCancel={() => { setOpenDelete(false) }}
        onConfirm={SubmitDelete}
        style={{ height: '19%', overflow:'hidden' }}
      />


    </div>

  )
}

export default Sidebar


