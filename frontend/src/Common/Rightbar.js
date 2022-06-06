import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { Container, makeStyles } from "@material-ui/core"
import { Avatar, AvatarGroup, AvatarBadge, Button, ChakraProvider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Following from '../Components/Following';
import { HomeContext } from '../Context/HomeContext';
import io from "socket.io-client";
import { getAllUsers } from '../Redux/Actions/authActions';
import { getAllCategories } from '../Redux/Actions/categoryAction';
import { createCategoryList } from '../utils/functions';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    height: "100%",
    color: "#555",
    position: "fixed",
    background: 'rgb(225, 228, 232)',
    top: 0,
    border: "1px solid #aaa",
    borderRight: 'none'
  }
}));

const ENDPOINT = "http://localhost:4000";
var socket;

const Rightbar = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)
  const [onlineUsers, setOnlineUsers] = useState([])
  const usersList = useSelector(state => state.users)
  const users = usersList.users
  const userId = auth.user.id

  const categoriesList = useSelector(state => state.categories)
  const hasFollowedCategory = createCategoryList(categoriesList.categories).filter(cat => cat.followers.includes(userId))

console.log(hasFollowedCategory)




  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("login", auth.user);
    //socket.emit("offline", auth.user);

    socket.emit("getrooms", (rooms) => {
      const roomsValues = Object.values(rooms);
      const ids = roomsValues.map(o => o.id)
      const filtered = roomsValues.filter(({ id }, index) => !ids.includes(id, index + 1))
      setOnlineUsers(filtered)
    })


  }, [])


  useEffect(() => {
    dispatch(getAllCategories())
    dispatch(getAllUsers())
  }, [dispatch])

  return (
    <Container className={classes.container}>
      <Box position="fixed" width={300}>

        <ChakraProvider>
          <Button
            size='lg'
            height={{ base: "48px", md: "40px", lg: "48px", sm: '38px' }}
            width={{ base: "200px", md: "150px", lg: "200px", sm: "110px" }}
            fontSize={{ base: "16px", md: "15px", lg: "16px", sm: "13px" }}
            colorScheme='facebook'
            variant='solid'
            onClick={() => navigate('/Add-Question')}>
            Ask Question
          </Button>
        </ChakraProvider>

        <Typography fontWeight={100} style={{ marginTop: '20px' }} fontSize={{ lg: '18px', md: '18px', sm: '16px' }} >
          Online Friends
        </Typography>
        <ChakraProvider>
          <AvatarGroup size='md' max={8}>

            {
              onlineUsers?.filter((user) => user.id !== auth.user.id).map((user, index) => (

                <Avatar name={user?.fullname} src={user?.pic}  >
                  <AvatarBadge bg='green.500' boxSize='1em' />
                </Avatar>


              ))}
          </AvatarGroup>
        </ChakraProvider>
        <Typography fontWeight={100} className='mb-3 mt-3' fontSize={{ lg: '18px', md: '18px', sm: '16px' }}>
          My Following
        </Typography>
        { (hasFollowedCategory.length>0) ?
          <Following/> : ''}
      </Box>
    </Container>
  )
}

export default Rightbar