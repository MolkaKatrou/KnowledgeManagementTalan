import { Typography, IconButton } from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookmarkQuestion, DownVoteQuestion, UpVoteQuestion } from "../../Redux/Actions/questionsActions";
import { useParams } from "react-router-dom";
import moment from 'moment';
//import ReactHtmlParser from "react-html-parser";
import BookmarkIcon from '@mui/icons-material/BookmarkOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { HomeContext } from "../../Context/HomeContext";


function QuestionAnswer({ question }) {
    const {t} = useContext(HomeContext)
    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const userId = auth.user.id
    const hasUpvotedquestion = question?.upVotes.find((vote) => vote === userId);
    const hasDownvotedquestion = question?.downVotes.find((vote) => vote === userId);
    const [upVotes, setUpVotes] = useState(question?.upVotes);
    const [downVotes, setDownVotes] = useState(question?.downVotes);
    const hasBookmarkedQuestion = question.bookmarks.find((bookmark) => bookmark === userId);
    const [bookmarks, setBookmarks] = useState(question.bookmarks);

    const Bookmarks = () => {
        if (bookmarks.length > 0) {
            return bookmarks.find((bookmark) => bookmark === userId)
                ? (
                    <BookmarkIcon style={{ color: '#937474' }} />
                ) : (
                    <BookmarkOutlinedIcon />
                );
        }

        return <BookmarkOutlinedIcon />
    };

    const handleBookmark = async () => {
        dispatch(BookmarkQuestion(question._id));
        if (hasBookmarkedQuestion) {
            setBookmarks(question.bookmarks.filter((id) => id !== userId));
        } else {
            setBookmarks([...question.bookmarks, userId]);
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
        dispatch(UpVoteQuestion(question._id));
        if (hasUpvotedquestion) {
            setUpVotes(question?.upVotes.filter((id) => id !== userId));
        } else {
            setDownVotes(question?.downVotes.filter((id) => id !== userId));
            setUpVotes([...question?.upVotes, userId]);
        }

    };

    const handleDownVote = async () => {
        dispatch(DownVoteQuestion(question._id));
        if (hasDownvotedquestion) {
            setDownVotes(question?.downVotes.filter((id) => id !== userId));
        }
        else {
            setUpVotes(question?.upVotes.filter((id) => id !== userId));
            setDownVotes([...question?.downVotes, userId]);
        }
    };


    return (
        <>
            <div className="main-top">
                <h2 className="main-question" >{question?.title}</h2>
            </div>
            <Typography component={'div'} variant='subtitle1' gutterBottom style={{ color: `${question?.category.color}` }}>
                {question?.category.name}
            </Typography>
            <div className="main-desc">
                <div className="info">
                    <p>
                        {t('Asked by')}
                        <span>{question?.createdby.fullname}</span>
                    </p>
                    <p>
                        {t('Posted')}<span>{moment(question.createdAt).fromNow()}</span>
                    </p>
                    {question.createdAt !== question.updated_At ?
                        <p> {t('Updated')}
                            <span> {moment(question?.updated_At).fromNow()} </span>
                        </p> : ''
                    }
                </div>
            </div>
            <div className="all-questions">
                <div className="all-questions-container">
                    <div className="all-questions-left">
                        <div className="all-options">
                            <IconButton className="arrow" onClick={handleUpVote}> <UpVote /></IconButton>
                            <p className="arrow info"> <i>{upVotes?.length - downVotes?.length || 0}</i></p>
                            <IconButton className="arrow" onClick={handleDownVote}><DownVote /></IconButton>
                            <IconButton onClick={handleBookmark} className="MyCustomButton">
                                <Bookmarks />
                            </IconButton>

                        </div>
                    </div>
                    <div className="question-answer">
                       <div className='card-content' dangerouslySetInnerHTML={{__html: question?.body}}/>
                    </div>
                </div>
            </div>
        </>


    );
}

export default QuestionAnswer;