import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import qa from '../../images/qa.png'
import { Container, makeStyles } from "@material-ui/core";
import Home from "./Home";
import { Button, ChakraProvider } from "@chakra-ui/react";
import { createCategoryList } from "../../utils/functions";
import { createQuestion } from "../../Redux/Actions/questionsActions";
import { Navigate, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Editor from "../../Components/Editor";
import { HomeContext } from "../../Context/HomeContext";


const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },

}));
function AddQuestion() {
  const {t} = useContext(HomeContext)
  const dispatch =useDispatch()
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [empty, setEmpty] = useState(false);
  const classes = useStyles()
  const categoriesList = useSelector(state => state.categories)
  const auth = useSelector(state => state.auth)
  const [files, setFiles] = useState([])

  const onEditorChange = (value) => {
    setBody(value);
}

const onFilesChange = (files) => {
    setFiles(files)
}

  const Clear = () => {
    setBody("")
    setTitle("")
    setCategory("")
    setEmpty(true)
    setTimeout(() => {
      setEmpty(false)
    }, 4000);
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const Question = {
      createdby: auth.user.id,
      category: category,
      title: title,
      body: body,
    }

    if (title && category && body) {
      dispatch(createQuestion(Question));
      toast.success(t('Question successfully created'));
      Clear()
    }
    else if (!title || !category || !body){
      toast.error(t('Fill all the fields to ask your question'))
  }


  }

  return (
    <>
      <Home>
        <Container className={`${classes.container} backgroundColor`}>
          <div className="add-question-container">
            <div className="head-title ">
              <h1>{t('Ask A Question')}</h1>
              <img src={qa} style={{ width: '26%' }}></img>
            </div>
            <form >

              <div className="form-group col-md-12">
                <label
                  style={{ fontWeight: 'bold', fontSize: '17px' }}> {t('Category')} <span className="text-danger">*</span>
                </label>
                <select
                  style={{ backgroundColor: 'transparent' }}
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)} >

                  <option className="backgroundColor-question" disabled value="">{t('Select a category')}</option>
                  {
                    createCategoryList(categoriesList.categories).map(option =>
                      <option className="backgroundColor-question" value={option.value}>{option.name}</option>)
                  }
                </select>
              </div>
              <div className="title">
                <label style={{ fontWeight: 'bold', fontSize: '17px' }}> {t('Title')}  <span className="text-danger">*</span> </label>
                <small className="small">
                  {t('Be specific and imagine you’re asking a question to another person')}
                </small>
                <input
                  style={{ backgroundColor: 'transparent' }}
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder={t("e.g Is there an R function for finding teh index of an element in a vector?")}
                  required
                  onChange={(e) => { setTitle(e.target.value) }}
                  value={title}

                />
              </div>
              <div className="question-option">
                <div className="title">
                  <label style={{ fontWeight: 'bold', fontSize: '19px' }}> {t('Body')} <span className="required"> <span className="text-danger">*</span> </span> </label>
                  <small  className="small">
                    {t('Include all the information someone would need to answer your question')}
                  </small>
                
                  <Editor
                      placeholder={t("Ask Your Question")}
                      onEditorChange={onEditorChange}
                      onFilesChange={onFilesChange}
                      empty={body}
                  />
             
                  
                </div>
              </div>
              <ChakraProvider>
                <Button colorScheme='teal' variant='solid' className="mt-3" onClick={onSubmit}>
                  {t('Add Your Question')}
                </Button>
              </ChakraProvider>
            </form>
          </div>
        </Container>
      </Home>

    </>
  );
}

export default AddQuestion;