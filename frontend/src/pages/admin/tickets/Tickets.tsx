import React, { useState } from "react";
import CustomTable from "@/components/CustomTable";

const ticketsData = [
  { createdAt: "2022-02-28T13:59:06.873Z", name: "Miss Dennis Hauck", email: "Lane.Friesen20@gmail.com", phoneNo: "521-272-6958", company: "Rippin Inc", lastActivity: "2021-09-30T12:24:31.084Z", leadStatus: "leadStatus 1", id: "1" },
  { createdAt: "2022-02-28T14:41:26.612Z", name: "Miss Rosalie Roob", email: "Sydney.Kreiger@yahoo.com", phoneNo: "(769) 607-0756 x2384", company: "Gottlieb, Grady and Walter", lastActivity: "2021-08-02T20:02:08.044Z", leadStatus: "leadStatus 2", id: "2" },
  { createdAt: "2022-02-27T17:56:52.394Z", name: "Della Hilpert V", email: "Nathen21@hotmail.com", phoneNo: "629-247-9024", company: "Roberts - Robel", lastActivity: "2021-07-16T14:33:29.290Z", leadStatus: "leadStatus 3", id: "3" },
  { createdAt: "2022-02-27T22:52:48.297Z", name: "Terence Ward", email: "Rebeka.Reynolds@hotmail.com", phoneNo: "217-274-6983", company: "Heathcote - Auer", lastActivity: "2021-11-19T09:19:35.469Z", leadStatus: "leadStatus 4", id: "4" },
  { createdAt: "2022-02-28T06:08:12.734Z", name: "Lorena Mitchell", email: "Adolfo.Jacobs@yahoo.com", phoneNo: "397.701.5266 x48198", company: "Kreiger LLC", lastActivity: "2021-11-16T11:11:28.863Z", leadStatus: "leadStatus 5", id: "5" },
];

const Tickets = () => {
  const [tickets] = useState(ticketsData);

  const columns = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone No.", name: "phoneNo" },
    { label: "Company", name: "company" },
    { label: "Last Activity", name: "lastActivity" },
    { label: "Lead Status", name: "leadStatus" },
    { label: "Created At", name: "createdAt" },
  ];

  return <CustomTable columns={columns} data={tickets} title="Tickets" />;
};

export default Tickets;
