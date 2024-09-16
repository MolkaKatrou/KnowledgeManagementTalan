import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import qa from '../../images/qa.png'
import { Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles } from "@material-ui/core";
import { Button, ChakraProvider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { createCategoryList } from "../../utils/functions";
import { createQuestion, updateQuestion } from "../../Redux/Actions/questionsActions";
import toast from 'react-hot-toast';
import { useContext } from "react";
import { HomeContext } from "../../Context/HomeContext";
import Editor from "../Editor";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10),
        height: '100%',
        backgroundColor: 'rgb(225, 228, 232)'
    },

}));

function UpdateQuestionModal({ isOpen,onClose, openModal, setOpenModal}) {
    const dispatch = useDispatch()
    const [category, setCategory] = useState("")
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [files, setFiles] = useState([])
    const categoriesList = useSelector(state => state.categories)
    const { questions, loading } = useSelector((state) => state.questions);
    const { currentQuestionId, setCurrentQuestionId } = useContext(HomeContext)
    const question = useSelector((state) => (currentQuestionId ? questions?.find((p) => p?._id === currentQuestionId) : null));
    const auth = useSelector(state => state.auth)


    const onEditorChange = (value) => {
        setBody(value);
    }

    const onFilesChange = (files) => {
        setFiles(files)
    }

    useEffect(() => {
        if (question) {
            setTitle(question.title);
            setCategory(question.category._id);
            setBody(question.body)
        }
    }, [currentQuestionId]);

    const Clear = () => {
        setBody("")
        setTitle("")
        setCategory("")
        setCurrentQuestionId(0)
        onClose()   
        setOpenModal(!openModal)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const Question = {
            createdby: auth.user.id,
            category: category,
            title: title,
            body: body,
        }

        if (currentQuestionId) {
            dispatch(updateQuestion(currentQuestionId, Question))
            toast.success('The question is updated successfully')
            Clear()

        }
    }


    return (
        <>
            <ChakraProvider>
                <Modal isOpen={isOpen} onClose={onClose} size='2xl' >
                    <ModalOverlay />
                    <ModalContent className="bg-light">
                        <ModalHeader>
                        <div className="head-title ">
                                    <h1>Edit your Question</h1>
                                    <img src={qa} style={{ width: '26%' }}></img>
                                </div>
                        </ModalHeader>
                      
                        <ModalBody>
                            <div className="add-question-container">
                              
                                <form >

                                    <div className="form-group col-md-12">
                                        <label
                                            style={{ fontWeight: 'bold', fontSize: '17px' }}> Category <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            style={{ backgroundColor: 'transparent' }}
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)} >

                                            <option style={{ backgroundColor: 'rgba(238, 238, 238)' }} disabled value="">Select a category</option>
                                            {
                                                createCategoryList(categoriesList.categories).map(option =>
                                                    <option style={{ backgroundColor: 'rgba(238, 238, 238)' }} value={option.value}>{option.name}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="title">
                                        <label style={{ fontWeight: 'bold', fontSize: '17px' }}> Title  <span className="text-danger">*</span> </label>
                                        <small>
                                            Be specific and imagine you’re asking a question to another
                                            person
                                        </small>
                                        <input
                                            style={{ backgroundColor: 'transparent' }}
                                            type="text"
                                            name="title"
                                            className="form-control"
                                            placeholder="e.g Is there an R function for finding teh index of an element in a vector?"
                                            required
                                            onChange={(e) => { setTitle(e.target.value) }}
                                            value={title}

                                        />
                                    </div>
                                    <div className="question-option">
                                        <div className="title">
                                            <label style={{ fontWeight: 'bold', fontSize: '19px' }}> Body <span className="required"> <span className="text-danger">*</span> </span> </label>
                                            <small>
                                                Include all the information someone would need to answer your
                                                question
                                            </small>
                                            <Editor
                                                currentId={currentQuestionId}
                                                question={question}
                                                onEditorChange={onEditorChange}
                                                onFilesChange={onFilesChange}
                                            />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </ModalBody>

                        <ModalFooter>

                            <Button variant='solid' style={{ marginRight: '15px' }} onClick={Clear}>
                                Cancel
                            </Button>
                            <Button colorScheme='teal' variant='solid' onClick={onSubmit}>
                                Edit Your Question
                            </Button>

                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ChakraProvider>




        </>
    );
}

export default UpdateQuestionModal;