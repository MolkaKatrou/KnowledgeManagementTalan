import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Moment from "react-moment";

const List = ({rows}) => {

  return (
    <TableContainer component={Paper} style={{backgroundColor:'rgba(241, 241, 241, 0.993)'}} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell"> ID</TableCell>
            <TableCell className="tableCell">Category</TableCell>
            <TableCell className="tableCell">Title</TableCell> 
            <TableCell className="tableCell">Likes</TableCell>
            <TableCell className="tableCell">Bookmarks</TableCell>
            <TableCell className="tableCell">Comments</TableCell>
            <TableCell className="tableCell">Created On</TableCell>
            <TableCell className="tableCell" style={{backgroundColor:'rgba(186, 191, 196, 0.993)'}}>Updated On</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, id) => (
            <TableRow key={row._id}>
              <TableCell className="tableCell">{id+1}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper" style={{color:`${row.category.color}`}}>
                  
                  
                <span className={`status ${row.category.name}`} style={{fontWeight:'700'}}>{row.category.name}</span>
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.title}</TableCell>
              <TableCell className="tableCell"><div className='mx-3'>{row.likes.length}</div></TableCell>
              <TableCell className="tableCell"><div className='mx-4'>{row.bookmarks.length}</div></TableCell>
              <TableCell className="tableCell"><div className='mx-3'>{row.comments.length}</div></TableCell>
              <TableCell className="tableCell">
            
               {row.createdAt.substr(0,10)} 
                
              </TableCell>
              <TableCell className="tableCell" style={{backgroundColor:'rgba(186, 191, 196, 0.993)'}}>
                {row.createdAt === row.updated_At ? '---':   row.updated_At.substr(0,10) }
             
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;




