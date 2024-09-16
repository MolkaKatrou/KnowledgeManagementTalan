import React, { useState, useEffect, useContext } from "react";
import { Box, Card,CardContent, Typography } from "@material-ui/core"
import image1 from '../images/card.png';
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from "react-redux";
import { CardMedia } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { FollowCategory, getAllCategories } from "../Redux/Actions/categoryAction";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import '../assets/Navbar.css';
import { HomeContext } from "../Context/HomeContext";
import { createCategoryList } from "../utils/functions";
import { DarkModeContext } from "../Context/darkModeContext";


  


 function CategoryBanner({ category }) {
    const {id} = useParams()
    const {darkMode} = useContext(DarkModeContext)
    const dispatch=useDispatch();
    const {t, followers, setFollowers, socket} = useContext(HomeContext)
    const auth = useSelector(state => state.auth)
    const userId = auth.user.id
    const hasFollowedCategory = category.followers.find((follower) => follower === userId);
    const categoriesList = useSelector(state => state.categories)
    const parentCategory = createCategoryList(categoriesList.categories).find(cat => cat?.value === category?.parentId);

    const handleNotification = (type) => {
        socket.emit("sendNotification", {
          sender: auth.user,
          receiver: category?.createdby,
          type,
          postId: category?.value,
          post: 'category',
    
        });
      };

    useEffect(() => {
          setFollowers(category.followers)
    },[id])

    const Followers = () => {
        if (followers.length > 0) {
            return followers.find((follower) => follower === userId)
                ? (
                    <Button
                       onClick={handleFollow}
                        color='violet'
                        content={t('Following')}
                        icon='check'
                        label={{ basic: true, color: 'violet', pointing: 'left', content: `${followers.length}` }}
                    />
                ) : (
                    <Button
                       onClick={handleFollow}
                        basic
                        color='violet'
                        content={t('Follow')}
                        icon='add'
                        label={{ basic: true, color: 'violet', pointing: 'left', content:`${followers.length}` }}
                    />
                );
        }

        return  <Button
                    onClick={handleFollow}
                    basic
                    color='violet'
                    content={t('Follow')}
                    icon='add'
                    label={{ basic: true, color: 'violet', pointing: 'left', content: `${followers.length}` }}
                />
    };

    const handleFollow = async () => {
        dispatch(FollowCategory(category.value));
        if (hasFollowedCategory) {
          setFollowers(category.followers.filter((id) => id !== userId));
        } else {
          setFollowers([...category.followers, userId]);
          handleNotification(12)
        }
        dispatch(getAllCategories())
      };
    
    return (
        <div>
        <Card style={{ marginBottom: '30px', background: darkMode? 'rgb(31, 30, 30)' : 'rgb(221, 220, 224)', border: `1px solid ${category.color}`, boxShadow: `0 1px 0 0 ${category.color}` }} className='d-flex justify-content-between'>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent style={{ flex: '1 0 auto' }}>
                    <Typography className="dark" gutterBottom variant="h6" component="div">
                        {category.name}
                    </Typography>

                    <Typography variant="subtitle1" style={{color:'#817A7A'}} component={'div'}>
                        {parentCategory?.name}
                    </Typography>
                </CardContent>
            </Box>
            <CardContent >
            <Followers />
            </CardContent>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                src={image1}
            />
        </Card>
        <Box style={{ width: '100%', marginBottom:'35px' , display:'flex', justifyContent:'center' }}>
            
        <Box className='nav-category'> 
            <NavLink  style={{ textDecoration: 'none' }} to= {`/category/${category.value}/notes`}   className='nav-links-categories' >Notes</NavLink>
        </Box>

        <Box className='nav-category'>     
            <NavLink  style={{ textDecoration: 'none' }} to={`/category/${category.value}/QA`} className='nav-links-categories'> Q/A </NavLink> 
        </Box>
               
          
        </Box>
        </div>
    )
}
export default CategoryBanner
