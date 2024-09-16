import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Tooltip } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core'
import SlidingPane from "react-sliding-pane";
import LoadingButton from '@mui/lab/LoadingButton';
import "react-sliding-pane/dist/react-sliding-pane.css";
import QuillEditor from '../../Components/QuillEditor';
import { createPost, deletePost, getAllPosts, updatePost } from '../../Redux/Actions/postsActions';
import { useContext } from 'react';
import { HomeContext } from '../../Context/HomeContext';
import { createCategoryList } from '../../utils/functions';
import toast from 'react-hot-toast';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { DarkModeContext } from '../../Context/darkModeContext';
import { getAllCategories } from '../../Redux/Actions/categoryAction';

const Styles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: 15,
        right: 10,
    },

    SlidingPane: {
        backgroundColor: '#dedce6',
        borderLeft: '1px solid #8a72ed',
    },

    SlidingPanedark: {
        backgroundColor: 'rgb(20, 20, 20)',
        borderLeft: '1px solid #111',
    },

    buttons: {
        display: 'flex',
        margin: '2rem',
        marginLeft: '260px'
    }
}));

export default function AddNote() {
    const [content, setContent] = useState("");
    const auth = useSelector(state => state.auth)
    const classes = Styles();
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [files, setFiles] = useState([])
    const categoriesList = useSelector(state => state.categories)
    const { t, openNote, setOpenNote, currentId, setCurrentId, dispatch } = useContext(HomeContext)
    const { posts, loading } = useSelector((state) => state.posts);
    const post = useSelector((state) => (currentId ? posts?.find((p) => p?._id === currentId) : null));
    const [open, setOpen] = React.useState(false);
    const { darkMode } = useContext(DarkModeContext)
    const [loadingButton, setLoadingButton]=useState(false)


  useEffect(() => {
    dispatch(getAllCategories())
  }, [])
  

    const onEditorChange = (value) => {
        setContent(value)
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }



    useEffect(() => { 
        if (post) {
            setTitle(post.title);
            setCategory(post.category._id);
            setContent(post.content)
            setFiles(post.content)
        }
    }, [currentId]);

    const Clear = () => {
        setOpenNote(false);
        setContent("")
        setTitle("")
        setCategory("")
        setCurrentId(0)
        setOpen(false)
    }

    const handleClickOpen = () => {
        if (title && category && content && !currentId) { setOpen(true); }
        else { Clear() }
    };

    const SaveDraft = (e) => {
        const variables = {
            createdby: auth.user.id,
            category: category,
            title: title,
            content: content,
            isDraft: true
        }
        dispatch(createPost(variables));
        Clear()
        toast.success(t("Post saved successfully as a draft"))
    }

    const onSubmit = (e) => {
        setCurrentId(0)
        e.preventDefault()
        const variables = {
            createdby: auth.user.id,
            category: category,
            title: title,
            content: content,
            isDraft: false,
        }
        if (!title || !category || !content) {
            toast.error(t('Fill all the fields to create your post'))
        }
        else {
            if (currentId === 0) {
                dispatch(createPost(variables, setLoadingButton));
                dispatch(getAllPosts())
                toast.success(t('Post successfully created'));
                if(!loadingButton){Clear()}
            }
            else if (currentId && !post.isDraft) {
                dispatch(updatePost(currentId, variables))
                toast.success(t('Post successfully updated'));
                Clear()
            }
            else if (currentId && post.isDraft) {
                dispatch(createPost(variables));
                dispatch(deletePost(post._id))
                toast.success(t('Post successfully created'));
                Clear()


            }
        }
    }

    return (
        <>
            <Tooltip title='Add' onClick={() => setOpenNote(true)}>
                <Fab color='primary' className={classes.fab}>
                    <Add></Add>
                </Fab>
            </Tooltip>

            <SlidingPane
                className={darkMode ? classes.SlidingPanedark : classes.SlidingPane}
                isOpen={openNote}
                width={window.innerWidth < 600 ? "100%" : "58%"}
            >
                <form>
                    <div className="form-group col-md-12">
                        <label style={{ fontWeight: 'bold', color: darkMode ? 'rgba(184, 173, 173, 0.4)' : '#111' }}> {t('Category')} <span className="required"> <span className="text-danger">*</span> </span> </label>
                        <select
                            className="form-control"
                            placeholder="Title"
                            style={{ backgroundColor: 'transparent', fontFamily: 'sans-serif' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>

                            <option style={{ backgroundColor: darkMode ? 'rgb(20, 20, 20)' : '#dedce6', color: darkMode ? '#dedce6' : "black" }} disabled value="">{t('Select a category')}</option>
                            {
                                createCategoryList(categoriesList.categories).map(option =>
                                    <option style={{ backgroundColor: darkMode ? 'rgb(20, 20, 20)' : '#dedce6', color: darkMode ? '#dedce6' : 'black' }} value={option.value}>{option.name}</option>)
                            }

                        </select>
                    </div>
                    <div className="form-group col-md-12 mt-3">
                        <label style={{ fontWeight: 'bold', color: darkMode ? 'rgba(184, 173, 173, 0.4)' : '#111' }}>{t('Title')} <span className="required"> <span className="text-danger">*</span> </span> </label>
                        <input
                            type="text"
                            name="title"
                            className='form-control'
                            placeholder={t("Title")}
                            style={{ backgroundColor: 'transparent', fontFamily: 'sans-serif', color: darkMode ? 'rgba(255, 250, 222)' : 'black' }}
                            required
                            onChange={(e) => { setTitle(e.target.value) }}
                            value={title}

                        />
                    </div>
                    <div className="form-group col-md-12 editor mt-3">
                        <label style={{ fontWeight: 'bold', color: darkMode ? 'rgba(184, 173, 173, 0.4)' : '#111' }}> Note <span className="required"> <span className="text-danger">*</span> </span> </label>

                        <QuillEditor
                            currentId={currentId}
                            post={post}
                            placeholder={t("Share your knowledge")}
                            onEditorChange={onEditorChange}
                            onFilesChange={onFilesChange}
                        />

                        <div className="d-flex mt-4"  >
                            <Button variant='outlined' style={{ fontFamily: 'PT Sans', fontWeight: 'bold' }} color="secondary" className='me-5' onClick={handleClickOpen}  >
                                {t('Cancel')}
                            </Button>
  
                            <LoadingButton  loading={loadingButton} variant='outlined' style={{ fontFamily: 'PT Sans', fontWeight: 'bold' }} color="primary" type='submit' onClick={onSubmit}>             
                                {currentId && post.isDraft === false ? t('Edit') : t('Create')}
                            </LoadingButton> 
                        </div>
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"

                        >
                            {/*<DialogTitle style={{color:'#626688', backgroundColor:'#E3E4E6', fontWeight:'700'}}>
                                {"Want to save the post as a draft?"}
                        </DialogTitle>*/}
                            <DialogContent style={{ backgroundColor: '#E3E4E6' }}>
                                <DialogContentText id="alert-dialog-description" >
                                    {t('You can save this post and share it later from your drafts')}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions style={{ backgroundColor: '#E3E4E6' }}>
                                <div className='mx-3 mt-2'>
                                    <Button className='mx-3' variant='outlined' color="primary" onClick={Clear}>{t('Cancel')}</Button>
                                    <Button variant='contained' color="primary" onClick={SaveDraft} endIcon={<SaveAsIcon />} autoFocus>{t('Save')}</Button>
                                </div>
                            </DialogActions>
                        </Dialog>
                    </div>
                </form>
            </SlidingPane>
        </>
    )
}
