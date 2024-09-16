import "./list.scss"
import Sidebar from "../../../Components/sidebar/Sidebar"
import Navbar from "../../../Components/navbar/Navbar"
import CategoriesTable from "../../../Components/datatable/CategoriesTable"

const Category = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <CategoriesTable/>
      </div>
    </div>
  )
}

export default Category