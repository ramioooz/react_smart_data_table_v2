import { Skeleton } from '@mui/joy';
import React from 'react';

type tttype = {
    colsNum? : number,
    rowsNum? : number,
    stl? : React.CSSProperties
}


const TableDataSkelaton = ({ colsNum = 1, rowsNum = 1, stl = {padding: "4px 12px"}}: tttype) => {
    return [...Array(rowsNum)].map((row, row_i) => (
        <tr key={row_i}>
            {[...Array(colsNum)].map((col, col_i) => (
                <td key={col_i} style={stl}>
                    <Skeleton animation="wave" variant="text" />
                </td>
            ))}
        </tr>
    ));
}

export default TableDataSkelaton