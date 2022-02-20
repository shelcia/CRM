import React, { useState } from "react";
import { Toolbar, Card, TableRow, TableCell } from "@mui/material";
import CustomBox from "../../../components/CustomBox";
import CustomTable from "../../../components/CustomTable";
import useTitle from "../../../hooks/useTitle";
import Footer from "../../../layout/common/Footer";

const Contacts = () => {
  useTitle("All Contacts");

  const [contacts] = useState([
    {
      _id: 1,
      title: "Some Title",
      desc: "Some Desc",
    },
    {
      _id: 2,
      title: "Some Title",
      desc: "Some Desc",
    },
    {
      _id: 3,
      title: "Some Title",
      desc: "Some Desc",
    },
    {
      _id: 4,
      title: "Some Title",
      desc: "Some Desc",
    },
    {
      _id: 5,
      title: "Some Title",
      desc: "Some Desc",
    },
  ]);

  const headers = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Dessert (100g serving)",
    },
    {
      id: "calories",
      numeric: true,
      disablePadding: false,
      label: "Calories",
    },
    {
      id: "fat",
      numeric: true,
      disablePadding: false,
      label: "Fat (g)",
    },
    {
      id: "carbs",
      numeric: true,
      disablePadding: false,
      label: "Carbs (g)",
    },
    {
      id: "protein",
      numeric: true,
      disablePadding: false,
      label: "Protein (g)",
    },
  ];

  return (
    <CustomBox
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - 260px)` },
        minHeight: "100vh",
      }}
    >
      <Toolbar />
      <Card>
        <CustomBox bgColor={"white"} variant="gradient">
          <CustomBox pt={3} px={3} className="table">
            <CustomTable headers={headers} rows={contacts}>
              {contacts.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.title}</TableCell>
                  <TableCell>{user.desc}</TableCell>
                </TableRow>
              ))}
            </CustomTable>
          </CustomBox>
        </CustomBox>
      </Card>
      <Footer />
    </CustomBox>
  );
};

export default Contacts;
