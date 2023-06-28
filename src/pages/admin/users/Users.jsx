import React from "react";
import CustomTable from "../../../components/CustomTable";
import { convertDateToDateWithoutTime } from "../../../utils/calendarHelpers";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";

const Users = () => {
  const data = [
    {
      id: "60fde2ee-a18a-48d8-a0e6-dc3749eea4b6",
      name: "Lucius",
      email: "Gerhard.Pollich@hotmail.com",
      phoneNo: "7",
      createdAt: "2083-12-27T06:27:31.886Z",
      lastActivity: "2020-12-03T12:56:12.450Z",
    },
    {
      id: "72bd5991-1ec4-438f-82d1-9e168b53d4c5",
      name: "Donato",
      email: "Hosea.Kuphal@hotmail.com",
      phoneNo: "6",
      createdAt: "2059-03-11T05:57:39.863Z",
      lastActivity: "2036-12-20T20:24:58.513Z",
    },
    {
      id: "9f928c0b-8cc5-4758-8749-151f2d2ad255",
      name: "Roma",
      email: "Curtis98@yahoo.com",
      phoneNo: "5",
      createdAt: "2068-04-09T16:01:12.783Z",
      lastActivity: "2020-11-19T00:31:21.763Z",
    },
    {
      id: "e1b58ad7-35ac-4ada-8ccc-9a0ff68229a7",
      name: "Dolores",
      email: "Kelsi_McGlynn86@yahoo.com",
      phoneNo: "5",
      createdAt: "2079-02-09T02:11:20.363Z",
      lastActivity: "2062-04-02T01:09:08.588Z",
    },
  ];
  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone No.", name: "phoneNo" },
    {
      label: "Last Activity",
      name: "lastActivity",
      options: {
        customBodyRender: (data) => (
          <span>{convertDateToDateWithoutTime(data)}</span>
        ),
      },
    },
    {
      label: "Created At",
      name: "createdAt",
      options: {
        customBodyRender: (data) => (
          <span>{convertDateToDateWithoutTime(data)}</span>
        ),
      },
    },
    {
      name: "url",
      label: "Actions",
      options: {
        customBodyRender: (tableMeta) => (
          <Button
            variant="contained"
            size="small"
            // onClick={() => {
            //   setIndex(tableMeta?.rowIndex);
            //   setOpen(true);
            // }}
          >
            View
          </Button>
        ),
      },
    },
  ];

  return (
    <>
      <Link to="add-user">
        <Button variant="contained" sx={{ marginLeft: "auto" }}>
          <AddIcon /> Add User
        </Button>
      </Link>

      <CustomTable
        columns={columns}
        data={data}
        title="Contacts"
        downloadName="contacts"
      />
    </>
  );
};

export default Users;
