import React from "react";
import {
  TableContainer,
  Table,
  Paper,
  // TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export const CustomBasicHorizontalTable = ({ columns, data }) => {
  console.log(data);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {columns.map((col, idx) => (
            <TableRow key={idx}>
              <TableCell>{col?.title}</TableCell>
              <TableCell>{data?.[col.field]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
