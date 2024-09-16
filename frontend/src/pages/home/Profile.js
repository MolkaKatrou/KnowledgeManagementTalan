import React, { useState, useEffect, useContext } from 'react'
import { Container, Grid, makeStyles } from "@material-ui/core"
import styled from "styled-components";
import Home from './Home';
import '../../Components/chart/chart.scss'
import { Avatar, Button, ButtonGroup, ChakraProvider, Editable, EditableInput, EditablePreview, Flex, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useEditableControls } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeContext } from '../../Context/HomeContext';
import { setUser, UpdateUser } from '../../Redux/Actions/authActions';
import store from '../../Redux/store'
import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WorkIcon from '@mui/icons-material/Work';
import CategoriesModal from '../../Components/CategoriesModal';
import { createCategoryList } from '../../utils/functions';
import { useParams } from 'react-router-dom';
import Post from '../../Components/posts/Post';
import { getAllPosts } from '../../Redux/Actions/postsActions';
import Question from '../../Components/Questions&Answers/Question';
import { DarkModeContext } from '../../Context/darkModeContext';



const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: '100%',
    backgroundColor: 'rgb(225, 228, 232)'
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '250px'
  },
}));

function Profile() {
  const { id } = useParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const categoryModal1 = useDisclosure()
  const categoryModal2 = useDisclosure()
  const { token,t } = useContext(HomeContext)
  const classes = useStyles()
  const [image, setImage] = useState("")
  const auth = useSelector(state => state.auth)
  const categoriesList = useSelector(state => state.categories)
  const postsList = useSelector(state => state.posts)
  const questionsList = useSelector(state => state.questions)
  const CreatedCategories = createCategoryList(categoriesList.categories).filter(cat => cat?.createdby?._id === id)
  const FollowedCategories = createCategoryList(categoriesList.categories).filter(cat => cat?.followers?.includes(id))
  const Createdposts = postsList.posts.filter(post => post?.createdby?._id === id)
  const Createdquestions = questionsList.questions.filter(post => post?.createdby?._id === id)
  const allcreated = Createdposts.concat(Createdquestions)
  const { darkMode } = useContext(DarkModeContext)


  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "knowledge-sharing")
      data.append("cloud_name", "knowledgetalent123")
      fetch("https://api.cloudinary.com/v1_1/knowledgetalent123/image/upload", {
        method: "post",
        body: data
      })
        .then(res => res.json())
        .then(data => {
          fetch('/Api/users/update/updatePicture', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              console.log(result)
              var args = JSON.parse(localStorage.getItem("user"));
              args["pic"] = result.pic;
              localStorage.setItem("user", JSON.stringify(args));
              store.dispatch(setUser(JSON.parse(localStorage?.getItem('user'))))
            })

        })
        .catch(err => {
          console.log(err)
        })
    }


  }, [localStorage, image])

  const updatePhoto = (file) => {
    setImage(file)
  }

  const deletePhoto = () => {
    fetch('/Api/users/update/updatePicture', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        pic: ""
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        setImage('')
        var args = JSON.parse(localStorage.getItem("user"));
        args["pic"] = result.pic;
        localStorage.setItem("user", JSON.stringify(args));
        store.dispatch(setUser(JSON.parse(localStorage?.getItem('user'))))
      })
  }

  const renderLatestAllCreated = allcreated.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).map((item, index) => (
    <>
      {item.content ?
        <Grid key={item._id}>
          <Post post={item} />
        </Grid>
        :
        <Grid key={item._id}>
          <Question question={item} />
        </Grid>
      }
    </>
  )
  )


  return (
    <Home>
      <Container className={`${classes.container} backgroundColor`}>
        <div className='artCard'>
          <div className='UserInfo'>
            <CardBackground />
            <a>
              <ChakraProvider>
                <Avatar onClick={onOpen} size='lg' style={{ cursor: 'pointer' }} name={auth.user.fullname} src={auth.user.pic}></Avatar>
                <Modal
                  size='sm'
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader> {t("Change Profile Picture")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody  pb={6} className='d-flex '>
                      <div>
                        <FormControl>
                          <label htmlFor="profilePhoto">
                            <input
                              accept="image/*"
                              id="profilePhoto"
                              type="file"
                              style={{ display: 'none', cursor: 'pointer' }}
                              onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                            <AddPhotoText> <UploadIcon /> {t("Upload a photo")}</AddPhotoText>
                          </label>
                        </FormControl>
                        <FormControl mt={4}>
                          <label>
                            <input
                              style={{ display: 'none', cursor: 'pointer' }}
                              onClick={deletePhoto}

                            />
                            <AddPhotoText><DeleteIcon /> {t("Delete the photo")}</AddPhotoText>
                          </label>
                        </FormControl>
                      </div>
                      <div style={{ marginLeft: '60px' }}>
                        <Avatar onClick={onOpen} size='lg' style={{ cursor: 'pointer', width: 100, height: 100 }} name={auth.user.fullname} src={auth.user.pic}></Avatar>
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <Button onClick={onClose} colorScheme='blue' mr={3}>
                        {t('Save')}
                      </Button>
                      <Button onClick={onClose}>{t('Cancel')}</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </ChakraProvider>


              <Link className='dark'>{t("Welcome, there!")}</Link>
            </a>
          </div>
          <div className='widget-profile'>
            <div className='d-flex mx-2'>
              <WorkIcon style={{ color: 'rgb(191, 205, 222)' }} />
              <h1 className='mx-2 mt-1'>{`${auth.user.occupation}, Talan Consulting`}</h1>
              <img style={{ width: '15px', height: '30%' }} src='/favicon.ico'></img>
            </div>
          </div>
          <div className='Item-profile'>
            <span className='dark' onClick={categoryModal1.onOpen} style={{ cursor: 'pointer' }}>
              {t('My Categories')}
            </span>
            <CategoriesModal
              categoryModal={categoryModal1}
              title={t("Categories I Created")}
              categories={CreatedCategories}
            ></CategoriesModal>
          </div>
        </div>

        <div className='communityCard'>
          <a>
            <span onClick={categoryModal2.onOpen} style={{ cursor: 'pointer' }}>{t('Followed Categories')}</span>
            <CategoriesModal
              categoryModal={categoryModal2}
              title={t("Categories I Follow")}
              categories={FollowedCategories}
            />
          </a>
          <a>
            <span className='dark'>{t('My activities')}</span>
          </a>
        </div>

        <div className='PostsCard'>
          {renderLatestAllCreated}
        </div>
      </Container>
    </Home>
  )
}

const Link = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`;

const AddPhotoText = styled.div`
  color: #0a66c2;
  margin-top: 15px;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  cursor:pointer;
`;

const CardBackground = styled.div`
  background: url("/photos/card-bg.svg");
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`;

export default Profile