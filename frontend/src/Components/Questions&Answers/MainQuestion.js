import { CircularProgress, Container, makeStyles, Grid } from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import Home from "../../pages/home/Home";
import { Button, ChakraProvider, Select, Stack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createAnswer, getAllAnswers, getAllQuestions } from "../../Redux/Actions/questionsActions";
import { useParams } from "react-router-dom";
import Answer from "./Answer";
import QuestionAnswer from "./QuestionAnswer";
import { HomeContext } from "../../Context/HomeContext";
import Alert from '@mui/material/Alert';
import toast from "react-hot-toast";
import QuillEditor from "../Editor";
import Editor from "../Editor";





const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },
  card: {
    maxWidth: 720,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '60px',
    background: 'transparent'
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '250px'
  },

}))
function MainQuestion() {
  const { t, setShowAlert, showAlert, comment,socket, fetch, setFetch } = useContext(HomeContext)
  const dispatch = useDispatch()
  const { id } = useParams()
  const classes = useStyles()
  const { questions, loading } = useSelector((state) => state.questions);
  const filteredQuestion = questions?.find((q) => q?._id === id);
  const [answer, setAnswer] = useState("");
  const [files, setFiles] = useState([]);
  const [newest, setNewest] = useState('newest');
  const auth = useSelector(state => state.auth)
  const { answers } = useSelector((state) => state.answers);
  const Answers = answers?.filter(answer => answer?.question?._id == id)

  useEffect(() => {
    dispatch(getAllQuestions())
  }, [])
  

  const handleNotification = (type) => {
    socket.emit("sendNotification", {
      sender: auth.user,
      receiver: filteredQuestion.createdby,
      postId : filteredQuestion._id,
       post:'question',
      type,    
    });
  };



  const onSubmit = async (e) => {
    e.preventDefault()
    const Answer = {
      createdby: auth.user.id,
      question: id,
      body: answer,
    }

    if (answer) {
      dispatch(createAnswer(Answer));
      setFetch(!fetch)
      toast.success('Answer added successfully')
      handleNotification(11)
      setAnswer('')
    }
  }

  const onEditorChange = (value) => {
    setAnswer(value);
  }

  const onFilesChange = (files) => {
    setFiles(files)
  }

  useEffect(() => {
    dispatch(getAllAnswers())
  }, [fetch])

  const handleChange = (value) => {
    setNewest(value)
  }

  return (
    <Home>
      <Container className={`${classes.container} backgroundColor`}>
        {loading ?
          <CircularProgress size="1em" elevation={2} className={classes.loadingPaper} />
          :

          <div className="main">
            <div className="main-container">
                <Grid key={filteredQuestion?._id}>
                  <QuestionAnswer question={filteredQuestion} />
                </Grid>
              <div style={{ flexDirection: "column" }} className="all-questions">
                <div className="d-flex justify-content-between">
                  <div
                    style={{
                      marginBottom: "20px",
                      fontSize: "1.8rem",
                      fontWeight: "300",
                    }}
                  >   <p>{`${Answers.length} ${t('Answer')}${Answers.length > 1 ? 's' : ''}`}</p>
                  </div>
                  <ChakraProvider>
                    <Stack spacing={3}>
                      <Select variant='filled' className='select-questions' onChange={(e) => handleChange(e.target.value)} >
                        <option className='select-questions' value='newest' >{t('Newest answers')}</option>
                        <option className='select-questions' value='popular' >{t('Most popular answers')}</option>
                      </Select>
                    </Stack>

                  </ChakraProvider>
                </div>
                {newest === 'newest' ? Answers.map((answer, index) => (
                  <Grid key={answer._id}>
                    <Answer
                      answer={answer}
                    />
                  </Grid>

                ))
                  : Answers.sort(function (one, other) {
                    let otherVotes = other.upVotes.length - other.downVotes.length
                    let oneVotes = one.upVotes.length - one.downVotes.length
                    return otherVotes - oneVotes;
                  }).map((answer, index) => (
                    <Grid key={answer._id}>
                      <Answer
                        answer={answer}
                      />
                    </Grid>
                  ))
                }

              </div>
            </div>
            <div className="main-answer">
              <h3
                style={{
                  fontSize: "22px",
                  margin: "10px 0",
                  fontWeight: "400",
                }}
              >
                {t('Your Answer')}
              </h3>
              <Editor
                placeholder={t("Add Your Answer")}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
                empty={answer}
              />

            </div>
            <div
              style={{
                marginTop: "50px",
                maxWidth: "fit-content",
              }}
            >

              <ChakraProvider>
                <Button
                  onClick={onSubmit}
                  colorScheme='blue'
                  size='lg'
                  width='250px'
                  variant='solid'
                  style={{ maxWidth: "fit-content" }}>
                  {t('Add Answer')}
                </Button>
              </ChakraProvider>
            </div>
          </div>
        }
      </Container>
    </Home>
  );
}

export default MainQuestion;