import {FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent} from "@mui/material";
import React from "react";

const PaginationComponent = (paging: any, adjustQueryString: any) => {

    const [pageSizes, setPageSizes] = React.useState([2, 5, 10]);

    const changePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        paging.pageNumber = newPage;
        adjustQueryString();
    }

    const changeSize = (event: SelectChangeEvent<any>) => {
        paging.pageNumber = 1;
        paging.pageSize = event.target.value;
        adjustQueryString();
    }

    return (
        <FormControl className="pagination" variant="standard">
            <InputLabel id="demo-simple-select-standard-label">Size</InputLabel>
            <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard"
                    value={paging.pageSize} onChange={changeSize} label="Size" className="size-select">
                {pageSizes.map((sizeValue: number) => {
                    return (
                        <MenuItem value={sizeValue}>{sizeValue}</MenuItem>
                    );
                })}
            </Select>
            <Pagination count={paging.totalPages} page={paging.pageNumber} onChange={changePage} className="page-select"/>
        </FormControl>
    );
}

export default PaginationComponent;