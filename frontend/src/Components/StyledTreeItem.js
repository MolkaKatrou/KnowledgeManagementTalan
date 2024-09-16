import React, {useContext} from 'react';
import { Box, makeStyles, Typography } from "@material-ui/core"
import PropTypes from 'prop-types';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import { styled } from '@mui/material/styles';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChakraProvider } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { HomeContext } from '../Context/HomeContext';


const CustomizedTheme = createTheme({
  palette: {
    action: {
      hover: purple[50],
    },
  },
});
const useStyles = makeStyles((theme) => ({
  ListItem:{
    "&.active": {
      backgroundColor: '--tree-view-bg-color'
    },
    '&:hover': {
      backgroundColor: '--tree-view-bg-color',
      color:'gray',
    },
  },

  text:{
    '&:hover': {
      color:'var(--tree-view-color)',
    },
  },
}));



const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderRadius: 5,
    paddingRight: theme.spacing(3),
    padding: theme.spacing(0.3),
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      backgroundColor: '--tree-view-bg-color',
      color:'inherit',
    },

    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },

}));

export default function StyledTreeItem(props) {
  const {t} = useContext(HomeContext)
  const classes = useStyles()
  const auth = useSelector(state=>state.auth)

  const {
    bgColor,
    color,
    labelText,
    createdby,
    handleOpen,
    OnDelete,
    OnUpdate,
    Id,
    ...other


  } = props;

  return (
    <>
      <Box>
        <StyledTreeItemRoot
          key={Id}
          nodeId={Id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 2 }} className={`${classes.ListItem} dark`}>
              <Typography className={classes.text} variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}  component={NavLink} to={`/category/${Id}/notes`} >
                {labelText}
              </Typography>
              <ChakraProvider>
                <Typography style={{ width: '10%', marginLeft: 'auto', marginRight: 0 }} component={'div'} >
                {
                auth.user.email === createdby?.email ? (
                  <Menu>
                    <MenuButton className='checkbox'><MoreHorizIcon style={{ width: '15px' }} /></MenuButton>
                    <MenuList className='backgroundColor' style={{position:'sticky' ,color:'gray', width: '150px' }}>
                      <MenuItem icon={<DeleteIcon style={{ marginRight: '30px', color: 'gray' }} />}
                        onClick={()=>{OnDelete(Id)}}
                      >
                        {t("Delete")}
                      </MenuItem>
                      <MenuItem icon={<EditIcon style={{ marginRight: '30px', color: 'gray' }} />}
                        onClick={()=>{OnUpdate(Id)}}
                      >
                        {t("Edit")}
                      </MenuItem>
                    </MenuList>
                  </Menu> ) :('') }
                </Typography>
              </ChakraProvider>
            </Box>
          }
          style={{
            '--tree-view-color': color,
            '--tree-view-bg-color': bgColor,
          }}
          {...other}
        />
      </Box>
    </>


  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};