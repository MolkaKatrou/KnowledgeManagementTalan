import React, { useContext, useState } from "react";
import "../assets/SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { InputBase, makeStyles } from "@material-ui/core";
import { HomeContext } from "../Context/HomeContext";
import { alpha } from "@material-ui/core"


const useStyles = makeStyles((theme) => ({
    search: {
        display: "flex",
        alignItems: "center",
        marginLeft: '-100px',
        borderRadius: '18px',
        border: "1px solid #aaa7",
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },

        width: '100%',
        [theme.breakpoints.down("xs")]: {
            width: "150px",
          },
    },


    searchContainer: {
        width:'50%',
        [theme.breakpoints.down("xs")]: {
            width: "390px",
          },
    },

}));



function SearchBar({ data, search, handleKeyPress, searchPost, filteredData, setFilteredData }) {
    const { setSearch,t } = useContext(HomeContext)
    const classes = useStyles()

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setSearch(searchWord)
        const newFilter = data?.filter((value) => {
            return value.title.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    const clearInput = () => {
        setFilteredData([]);
        setSearch("");
    };

    const searchResult = (value) => {
        setSearch(value.title)
        setFilteredData([])
    };
    


    return (
        <div className={classes.searchContainer}>
            <div className="searchInputs">
                <div className={classes.search} style={{borderEndEndRadius : filteredData?.length ? '0px' : '18px', borderEndStartRadius : filteredData?.length ? '0px' : '18px'}}>
                    {filteredData?.length === 0 ? (
                        <SearchIcon className='mx-3' onClick={searchPost} style={{ cursor: 'pointer' }} />
                    ) : (
                        <CloseIcon className='mx-3' onClick={clearInput} style={{ cursor: 'pointer' }} />
                    )}

                    <InputBase
                        onKeyDown={handleKeyPress}
                        placeholder={t("Search..")}
                        className='me-2 search search-sidebar'
                        name="search"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleFilter}
                        autoComplete='off'
                    />

                </div>
            </div>
            {filteredData?.length !== 0 && (
                <div className="dataResult">
                    {filteredData?.slice(0, 15).map((value, key) => {
                        return (
                            <a className="dataItem" onClick={() => searchResult(value)}>
                                <p>{value.title} </p>
                            </a>
                        );
                    })}
                </div>


            )}
        </div>
    );
}

export default SearchBar;