import * as React from 'react';
import {List, ListItemText} from '@mui/material';
import { useSelector } from 'react-redux';
import { createCategoryList } from '../utils/functions';
import { ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    List:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: 240,
        backgroundColor:'rgba(71, 98, 130, 0.2)',
        [theme.breakpoints.down("md")]: {
            width:'85%',
          },
          [theme.breakpoints.down("sm")]: {
            width:'155px',
          },
    },
  }));
  

export default function Following() {
    const classes = useStyles()
    const theme = createTheme({});
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()
    const userId = auth.user.id
    const categoriesList = useSelector(state => state.categories)
    const hasFollowedCategory = createCategoryList(categoriesList.categories).filter(cat => cat.followers.includes(userId))
    return (
        <ThemeProvider theme={theme}>
        <List className={classes.List}>

            {hasFollowedCategory.map((category) => (
                <ListItemButton
                    key={category.value}
                    onClick={() => navigate(`/category/${category.value}/notes`)}
                    className='px-2'
                    style={{color: 'rgba(255,255,255,.8)', maxHeight: 32,  width:'100%' ,
                      
                    backgroundColor:'rgba(71, 98, 130, 0.2)'}}
                    
                >

                    <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                    />

                </ListItemButton>
            ))}

        </List>
    </ThemeProvider>
    );
}