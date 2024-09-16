import React, { useState, useContext, useEffect } from "react";
import { makeStyles, Box, Card, CardContent, Typography, CardHeader, IconButton, useTheme, useMediaQuery } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from 'moment';
import { Col } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { Confirm } from 'semantic-ui-react'
import { BookmarkQuestion, deleteQuestion, DownVoteQuestion, getAllQuestions, UpVoteQuestion } from "../../Redux/Actions/questionsActions";
import { HomeContext } from "../../Context/HomeContext";
//import ReactHtmlParser from "react-html-parser";
import BookmarkIcon from '@mui/icons-material/BookmarkOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import UpdateQuestionModal from "./UpdateQuestionModal";
import toast from "react-hot-toast";
import Delete from '@mui/icons-material/Delete';




const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 660,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '40px',
    background: 'rgb(234, 233, 240)'
  }

}));

function Question({ question }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {t, setShowAlert, socket, openModal, setOpenModal, showAlert, setCurrentQuestionId } = useContext(HomeContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { answers } = useSelector((state) => state.answers);
  const AllAnswers = answers?.filter(answer => answer?.question?._id == question?._id)
  const auth = useSelector(state => state.auth)
  const userId = auth.user.id
  const hasUpvotedquestion = question?.upVotes?.find((vote) => vote === userId);
  const hasDownvotedquestion = question?.downVotes?.find((vote) => vote === userId);
  const hasBookmarkedQuestion = question?.bookmarks?.find((bookmark) => bookmark === userId);
  const [upVotes, setUpVotes] = useState(question?.upVotes);
  const [downVotes, setDownVotes] = useState(question?.downVotes);
  const [bookmarks, setBookmarks] = useState(question?.bookmarks);
  const [open, setOpen] = useState(false)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));



  const classes = useStyles()
  const location = useLocation()

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: auth.user,
      receiver: question?.createdby,
      questionId: question?._id,
      question: 'question',
      type,
    });
  };



  const DeleteQuestion = () => {
    dispatch(deleteQuestion(question?._id))
    setOpen(false)
    setShowAlert(!showAlert)
    toast.success("The Question is successfully deleted")
  }

  const Bookmarks = () => {
    if (bookmarks?.length > 0) {
      return bookmarks?.find((bookmark) => bookmark === userId)
        ? (
          <BookmarkIcon style={{ color: '#937474' }} />
        ) : (
          <BookmarkOutlinedIcon />
        );
    }

    return <BookmarkOutlinedIcon />
  };

  const handleBookmark = async () => {
    dispatch(BookmarkQuestion(question?._id));
    if (hasBookmarkedQuestion) {
      setBookmarks(question?.bookmarks.filter((id) => id !== userId));
    } else {
      setBookmarks([...question?.bookmarks, userId]);
    }

  };

  const UpVote = () => {
    if (upVotes?.length > 0) {
      return upVotes?.find((vote) => vote === userId)
        ? (
          <i className="fa-solid fa-circle-up" style={{ color: 'green' }}></i>
        ) : (
          <i className="fa-solid fa-circle-up" style={{ color: 'gray' }}></i>
        );
    }

    return <i className="fa-solid fa-circle-up" style={{ color: 'gray' }}></i>
  };

  const DownVote = () => {
    if (downVotes?.length > 0) {
      return downVotes?.find((vote) => vote === userId)
        ? (
          <i className="fa-solid fa-circle-down" style={{ color: 'green' }}></i>
        ) : (
          <i className="fa-solid fa-circle-down" style={{ color: 'gray' }}></i>
        );
    }

    return <i className="fa-solid fa-circle-down" style={{ color: 'gray' }}></i>
  };

  const handleUpVote = async () => {
    dispatch(UpVoteQuestion(question?._id));
    if (hasUpvotedquestion) {
      setUpVotes(question?.upVotes.filter((id) => id !== userId));
    } else {
      setDownVotes(question?.downVotes.filter((id) => id !== userId));
      setUpVotes([...question?.upVotes, userId]);
      handleNotification(4)
    }

  };

  const handleDownVote = async () => {
    dispatch(DownVoteQuestion(question?._id));
    if (hasDownvotedquestion) {
      setDownVotes(question?.downVotes.filter((id) => id !== userId));
    }
    else {
      setUpVotes(question?.upVotes?.filter((id) => id !== userId));
      setDownVotes([...question?.downVotes, userId]);
      handleNotification(5)

    }
  };

  const UpdateQuestion = (e) => {
    e.stopPropagation();
    setCurrentQuestionId(question?._id);
    onOpen()
  }

  return (
    <ChakraProvider>
      <Card className={`${classes.card} card-color`}>
        <CardHeader
          avatar={
            <ChakraProvider><Avatar name={question?.createdby?.fullname} src={question?.createdby?.pic}></Avatar></ChakraProvider>
          }
          action={
            <>
              {
                auth.user.email === question?.createdby?.email ? (
              <Menu isLazy>
                <MenuButton><MoreVertIcon /></MenuButton>
                <MenuList className='backgroundColor'>
                  <MenuItem icon={<DeleteIcon style={{ marginRight: '30px', color: 'gray' }} />}
                    onClick={() => { setOpen(true) }}
                  >
                    {t('Delete')}
                  </MenuItem>
                  <MenuItem icon={<EditIcon style={{ marginRight: '30px', color: 'gray' }} />}
                    onClick={UpdateQuestion}
                  >
                    {t('Edit')}
                  </MenuItem>
                </MenuList>
              </Menu> ) :('') 
              
              }
              <Confirm
                confirmButton={t("Delete Question")}
                cancelButton={t('Cancel')}
                open={open}
                content={t('Are you sure you want to delete this question?')}
                onCancel={() => { setOpen(false) }}
                onConfirm={DeleteQuestion}
                style={{ height: '19%', overflow:'hidden' }}              
              />
             
            </>

          }
          title={
            <div className='row'>
              <div className='col-5'> {question?.createdby?.fullname} </div>

              <Typography component={'div'} className='col-5' onClick={() => navigate(`/category/${question?.category._id}/notes`)} style={{ color: `${question?.category?.color}`, textAlign: 'center', fontWeight: '600', display: location.pathname === `/category/${question?.category._id}/notes` ? "none" : "flex" }}>
                {`  ${question?.category?.name} `}

              </Typography>

            </div>}
          subheader={<div className='d-flex info-post'>
          {moment(question?.createdAt).fromNow()}

          {question?.createdAt !== question?.updated_At ? 
          <p className='d-flex' >
            <span style={{fontWeight:'700'}} className='mx-2'>{t('updated')} </span>
            {` ${moment(question?.updated_At).fromNow()}`} 
            </p> : ''}

        </div>}
        >
        </CardHeader>
        <CardContent className="d-flex">
          <Col sm={6} lg={3} md={4}>
            <Button.Group style={{ marginTop: '-15px', marginLeft: '-6px' }}>
              <IconButton onClick={handleUpVote}> <UpVote /></IconButton>
              <IconButton style={{ marginLeft: '-3px', marginRight: '-3px' }} className='info'> <i>{upVotes?.length - downVotes?.length}</i></IconButton>
              <IconButton onClick={handleDownVote}><DownVote /></IconButton>
            </Button.Group>
            <div className="d-flex" style={{ marginLeft: '-10px' }}>
              <Button style={{ fontSize: '78%', width: '58%' }} color='violet' className='mt-3 mx-3' onClick={() => navigate(`/Main-Question/${question?._id}`)}>{`${AllAnswers?.length}  ${t('Answer')}${AllAnswers?.length > 1 ? 's' : ''}`}</Button>
              <IconButton onClick={handleBookmark} className="MyCustomButton" style={{ marginLeft: '-20px' }}>
                <Bookmarks />
              </IconButton>
            </div>
          </Col>

          <Col sm={5} xs={8} lg={8} md={7} onClick={() => navigate(`/Main-Question/${question?._id}`)}>
            <Typography component={'div'} className='question-title' style={{ marginBottom: '20px', cursor: 'pointer' }}>
              {question?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div" >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', marginTop: '10px' }}
                className='card-content' dangerouslySetInnerHTML={{__html: question?.body}}/>
            </Typography>
          </Col>
        </CardContent>
      </Card>
      <UpdateQuestionModal onClose={onClose} isOpen={isOpen} openModal={openModal} setOpenModal={setOpenModal}/>
    </ChakraProvider>
  );
}

export default Question;

