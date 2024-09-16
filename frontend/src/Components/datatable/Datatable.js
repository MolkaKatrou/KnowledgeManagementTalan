import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IconButton, InputBase, Paper } from "@mui/material";
import { Confirm } from 'semantic-ui-react'
import SearchIcon from '@mui/icons-material/Search';
import toast from "react-hot-toast";
import { HomeContext } from "../../Context/HomeContext";
import { Avatar, ChakraProvider } from "@chakra-ui/react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Moment from "react-moment";


const Datatable = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const auth = useSelector(state => state.auth)
  const [open, setOpen]=useState(false)
  const [deleteId, setdeleteId]=useState('')
  const {t}=useContext(HomeContext)
  const user = users?.find(u=>u._id===deleteId)


  useEffect(async () => {
    await axios.get("/Api/users").then((res) => {
      setUsers(res.data.filter(u => u._id !== auth.user.id));
    });
  }, [show]);

  const filterContent = (users, searchTerm) => {
    const result = users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchTerm) ||
        user.lastname.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.occupation.toLowerCase().includes(searchTerm)
    );
    setUsers(result);
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const searchTerm = e.target.value;
    axios.get("/Api/users")
      .then(res => {
        filterContent(res.data.filter(u => u._id !== auth.user.id), searchTerm);
        console.log(searchTerm)

      });
  };

  const handleDelete = () => {
      axios.delete(`/Api/users/${deleteId}`)
        .then(res => {
          setShow(!show)
          setOpen(false)
          setTimeout(() => {
            toast.success('The collaborator has been successfully deleted')
          }, 2000);
        })
  }

  const ConfirmDelete = (id) => {
    setOpen(true)
    setdeleteId(id)

}

const userColumns = [
  {
    field: "fullname",
    headerName: t("Collaborator"),
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <ChakraProvider>
            <Avatar src={params.row.pic} name={params.row.fullname}  size='sm'></Avatar>
          </ChakraProvider> 
          <div className="mx-3">{params.row.fullname}</div>       
          
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 190,
  },

  {
    field: "phone",
    headerName: t("Phone"),
    width: 90,
  },

  {
    field: "occupation",
    headerName: t("Occupation"),
    width: 150,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.occupation}`}>
          {params.row.occupation}
        </div>
      );
    },
  },

  {
    field: "isVerified",
    headerName: t("Status"),
    width: 80,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus`} style={{marginLeft:'-6px'}} >
          {params.row.isVerified ? 
          <div className="active">{t("Verified")}</div> : 
          <div className="pending" >{t("Pending")}</div> 
          }
        </div>
      );
    },
  },

  {
    field: "role",
    headerName: t("IS ADMIN"),
    width: 90,
    renderCell: (params) => {
      return (
        <div className='mx-4'>
          {params.row.role === 'ADMIN' ? <CheckIcon/> : <CloseIcon/> }
        </div>
      );
    },
  },

  {
    field: "createdAt",
    headerName: t("Created On"),
    width: 120,
    renderCell: (params) => {
        return (
            <div className={`cellWithStatus ${params.row.createdAt}`}>

                <Moment format="YYYY/MM/DD">
                    {params.row.createdAt}
                </Moment>

            </div>
        );
    },
},
];





  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 187,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">{t("View")}</div>
            </Link>
            <Link to={`/users/update/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="UpdateButton">{t("Update")}</div>
            </Link>

            <div
              className="deleteButton"
              onClick={() => ConfirmDelete(params.row._id)}
            >
              {t("Delete")}
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        <Link to="/users/new" className="link">
          {t("Add New Collaborator")}
        </Link>
        <Paper
          sx={{ p: '1px 1px', display: 'flex', alignItems: 'center', width: 400, bgcolor: 'transparent' }}
          style={{ borderRadius: '18px', border: '1px solid #DDD4D4' }}
          className='Search-admin'
        >
          <IconButton>
            <SearchIcon className='Search-admin' />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("Search..")}
            className='Search-admin'
            onChange={handleSearch}
            inputProps={{ 'aria-label': 'search ' }}
          />

        </Paper>
      </div>
      {users ?
        <DataGrid
          getRowId={(row) => row._id}
          className="datagrid"
          rows={users}
          columns={userColumns.concat(actionColumn)}
          pageSize={7}
          rowsPerPageOptions={[7]}
          checkboxSelection

        /> :

        <DataGrid
          className="datagrid"
          columns={userColumns.concat(actionColumn)}
          loading='true'
        />
      }


    
      <Confirm
        confirmButton={t("Delete The User")}
        cancelButton={t('Cancel')}
        content={`${t('Are you sure you want to delete' )} ${user?.fullname}'s account ?`}
        open={open}
        onCancel={() => { setOpen(false) }}
        onConfirm={handleDelete}
        style={{ height: '19%', overflow:'hidden' }}
      />
    </div>
  );
};

export default Datatable;
