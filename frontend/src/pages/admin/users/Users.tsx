import React from "react";
import CustomTable from "@/components/CustomTable";
import { convertDateToDateWithoutTime } from "@/utils/calendarHelpers";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Users = () => {
  const data = [
    { id: "60fde2ee", name: "Lucius", email: "Gerhard.Pollich@hotmail.com", phoneNo: "7", createdAt: "2083-12-27T06:27:31.886Z", lastActivity: "2020-12-03T12:56:12.450Z" },
    { id: "72bd5991", name: "Donato", email: "Hosea.Kuphal@hotmail.com", phoneNo: "6", createdAt: "2059-03-11T05:57:39.863Z", lastActivity: "2036-12-20T20:24:58.513Z" },
    { id: "9f928c0b", name: "Roma", email: "Curtis98@yahoo.com", phoneNo: "5", createdAt: "2068-04-09T16:01:12.783Z", lastActivity: "2020-11-19T00:31:21.763Z" },
    { id: "e1b58ad7", name: "Dolores", email: "Kelsi_McGlynn86@yahoo.com", phoneNo: "5", createdAt: "2079-02-09T02:11:20.363Z", lastActivity: "2062-04-02T01:09:08.588Z" },
  ];

  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone No.", name: "phoneNo" },
    {
      label: "Last Activity",
      name: "lastActivity",
      options: { customBodyRender: (data) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
    {
      label: "Created At",
      name: "createdAt",
      options: { customBodyRender: (data) => <span>{convertDateToDateWithoutTime(data)}</span> },
    },
    {
      label: "Actions",
      name: "url",
      options: {
        customBodyRender: () => (
          <Button size="sm" variant="outline">View</Button>
        ),
      },
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-3">
        <Link to="add-user">
          <Button>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </Link>
      </div>
      <CustomTable columns={columns} data={data} title="Users" downloadName="users" />
    </>
  );
};

export default Users;
