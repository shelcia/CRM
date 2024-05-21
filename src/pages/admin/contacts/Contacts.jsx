// import { Button, Card, Checkbox, Icon } from "@mui/material";
// import React, { useState } from "react";
// import { CustomBasicHorizontalTable } from "../../../customcomponents/CustomBasicTable";
// import CustomModal from "../../../customcomponents/CustomModal";
// // import CustomTable from "../../../customcomponents/CustomTable";
// // import { convertDateToDateWithoutTime } from "../../../utils/calendarHelpers";
// // import AddContact from "./AddContact";
// import MDBox from "../../../components/MDBox";
// import MDTypography from "../../../components/MDTypography";
// import DataTable from "../../../customcomponents/Tables/DataTable";
// import MDButton from "../../../components/MDButton";
// import MDAvatar from "../../../components/MDAvatar";

// const Contacts = () => {
//   const [index, setIndex] = useState(0);
//   const [contacts] = useState([
//     {
//       createdAt: "2022-02-28T13:59:06.873Z",
//       name: "Miss Dennis Hauck",
//       email: "Lane.Friesen20@gmail.com",
//       phoneNo: "521-272-6958",
//       company: "Rippin Inc",
//       lastActivity: "2021-09-30T12:24:31.084Z",
//       leadStatus: "leadStatus 1",
//       id: "1",
//     },
//     {
//       createdAt: "2022-02-28T14:41:26.612Z",
//       name: "Miss Rosalie Roob",
//       email: "Sydney.Kreiger@yahoo.com",
//       phoneNo: "(769) 607-0756 x2384",
//       company: "Gottlieb, Grady and Walter",
//       lastActivity: "2021-08-02T20:02:08.044Z",
//       leadStatus: "leadStatus 2",
//       id: "2",
//     },
//     {
//       createdAt: "2022-02-27T17:56:52.394Z",
//       name: "Della Hilpert V",
//       email: "Nathen21@hotmail.com",
//       phoneNo: "629-247-9024",
//       company: "Roberts - Robel",
//       lastActivity: "2021-07-16T14:33:29.290Z",
//       leadStatus: "leadStatus 3",
//       id: "3",
//     },
//     {
//       createdAt: "2022-02-27T22:52:48.297Z",
//       name: "Terence Ward",
//       email: "Rebeka.Reynolds@hotmail.com",
//       phoneNo: "217-274-6983",
//       company: "Heathcote - Auer",
//       lastActivity: "2021-11-19T09:19:35.469Z",
//       leadStatus: "leadStatus 4",
//       id: "4",
//     },
//     {
//       createdAt: "2022-02-28T06:08:12.734Z",
//       name: "Lorena Mitchell",
//       email: "Adolfo.Jacobs@yahoo.com",
//       phoneNo: "397.701.5266 x48198",
//       company: "Kreiger LLC",
//       lastActivity: "2021-11-16T11:11:28.863Z",
//       leadStatus: "leadStatus 5",
//       id: "5",
//     },
//     {
//       createdAt: "2022-02-28T15:33:16.064Z",
//       name: "Jody Mayert",
//       email: "Zelma_Wilkinson68@yahoo.com",
//       phoneNo: "1-398-281-5304 x426",
//       company: "Nader, Walter and Kunde",
//       lastActivity: "2021-11-13T18:36:28.098Z",
//       leadStatus: "leadStatus 6",
//       id: "6",
//     },
//     {
//       createdAt: "2022-02-28T06:38:57.922Z",
//       name: "Lena Hilpert DDS",
//       email: "Jada.Murphy56@yahoo.com",
//       phoneNo: "(398) 351-5911 x76762",
//       company: "Brakus, Hoeger and Lang",
//       lastActivity: "2021-10-01T13:13:49.610Z",
//       leadStatus: "leadStatus 7",
//       id: "7",
//     },
//     {
//       createdAt: "2022-02-28T03:45:50.263Z",
//       name: "Penny McCullough",
//       email: "Karlee.Schmidt59@gmail.com",
//       phoneNo: "843-578-7090 x582",
//       company: "Raynor Inc",
//       lastActivity: "2021-12-05T10:59:29.417Z",
//       leadStatus: "leadStatus 8",
//       id: "8",
//     },
//     {
//       createdAt: "2022-02-28T07:29:39.870Z",
//       name: "Israel Lockman",
//       email: "Ardella_Crist@yahoo.com",
//       phoneNo: "(799) 513-4416",
//       company: "Graham, Mante and O'Conner",
//       lastActivity: "2021-07-25T23:13:54.428Z",
//       leadStatus: "leadStatus 9",
//       id: "9",
//     },
//     {
//       createdAt: "2022-02-28T11:34:50.557Z",
//       name: "Glenda Beer",
//       email: "Kamron_Lindgren@hotmail.com",
//       phoneNo: "821-617-9144",
//       company: "Ledner, Schuster and Bergstrom",
//       lastActivity: "2022-01-04T07:37:26.060Z",
//       leadStatus: "leadStatus 10",
//       id: "10",
//     },
//   ]);

//   // const columns = [
//   //   { label: "Name", name: "name" },
//   //   { label: "Email", name: "email" },
//   //   { label: "Phone No.", name: "phoneNo" },
//   //   {
//   //     label: "Company",
//   //     name: "company",
//   //   },
//   //   {
//   //     label: "Last Activity",
//   //     name: "lastActivity",
//   //     options: {
//   //       customBodyRender: (data) => (
//   //         <span>{convertDateToDateWithoutTime(data)}</span>
//   //       ),
//   //     },
//   //   },
//   //   { label: "Lead Status", name: "leadStatus" },
//   //   {
//   //     label: "Created At",
//   //     name: "createdAt",
//   //     options: {
//   //       customBodyRender: (data) => (
//   //         <span>{convertDateToDateWithoutTime(data)}</span>
//   //       ),
//   //     },
//   //   },
//   //   {
//   //     name: "url",
//   //     label: "Actions",
//   //     options: {
//   //       customBodyRender: (tableMeta) => (
//   //         <Button
//   //           variant="contained"
//   //           size="small"
//   //           onClick={() => {
//   //             setIndex(tableMeta?.rowIndex);
//   //             setOpen(true);
//   //           }}
//   //         >
//   //           View
//   //         </Button>
//   //       ),
//   //     },
//   //   },
//   // ];

//   const [open, setOpen] = useState(false);
//   // const [openAddContactModal, setOpenAddContactModal] = useState(false);

//   const dataTableData = {
//     columns: [
//       {
//         Header: "id",
//         accessor: "id",
//         Cell: ({ value }) => <IdCell id={value} />,
//       },
//       {
//         Header: "date",
//         accessor: "date",
//         Cell: ({ value }) => <DefaultCell value={value} />,
//       },
//       {
//         Header: "status",
//         accessor: "status",
//         Cell: ({ value }) => {
//           let status;

//           if (value === "paid") {
//             status = <StatusCell icon="done" color="success" status="Paid" />;
//           } else if (value === "refunded") {
//             status = (
//               <StatusCell icon="replay" color="dark" status="Refunded" />
//             );
//           } else {
//             status = (
//               <StatusCell icon="close" color="error" status="Canceled" />
//             );
//           }

//           return status;
//         },
//       },
//       {
//         Header: "customer",
//         accessor: "customer",
//         Cell: ({ value: [name, data] }) => (
//           <CustomerCell
//             image={data.image}
//             color={data.color || "dark"}
//             name={name}
//           />
//         ),
//       },
//       {
//         Header: "product",
//         accessor: "product",
//         Cell: ({ value }) => {
//           const [name, data] = value;

//           return (
//             <DefaultCell
//               value={typeof value === "string" ? value : name}
//               suffix={data.suffix || false}
//             />
//           );
//         },
//       },
//       {
//         Header: "revenue",
//         accessor: "revenue",
//         Cell: ({ value }) => <DefaultCell value={value} />,
//       },
//     ],

//     rows: [
//       {
//         id: "#10421",
//         date: "1 Nov, 10:20 AM",
//         status: "paid",
//         customer: ["Orlando Imieto"],
//         product: "Nike Sport V2",
//         revenue: "$140,20",
//       },
//       {
//         id: "#10422",
//         date: "1 Nov, 10:53 AM",
//         status: "paid",
//         customer: ["Alice Murinho"],
//         product: "Valvet T-shirt",
//         revenue: "$42,00",
//       },
//       {
//         id: "#10423",
//         date: "1 Nov, 11:13 AM",
//         status: "refunded",
//         customer: ["Michael Mirra", { image: "M" }],
//         product: ["Leather Wallet", { suffix: "+1 more" }],
//         revenue: "$25,50",
//       },
//       {
//         id: "#10424",
//         date: "1 Nov, 12:20 PM",
//         status: "paid",
//         customer: ["Andrew Nichel"],
//         product: "Bracelet Onu-Lino",
//         revenue: "$19,40",
//       },
//       {
//         id: "#10425",
//         date: "1 Nov, 1:40 PM",
//         status: "canceled",
//         customer: ["Sebastian Koga"],
//         product: ["Phone Case Pink", { suffix: "x 2" }],
//         revenue: "$44,90",
//       },
//       {
//         id: "#10426",
//         date: "1 Nov, 2:19 PM",
//         status: "paid",
//         customer: ["Laur Gilbert", { image: "L" }],
//         product: "Backpack Niver",
//         revenue: "$112,50",
//       },
//       {
//         id: "#10427",
//         date: "1 Nov, 3:42 AM",
//         status: "paid",
//         customer: ["Iryna Innda", { image: "I" }],
//         product: "Adidas Vio",
//         revenue: "$200,00",
//       },
//       {
//         id: "#10428",
//         date: "2 Nov, 9:32 AM",
//         status: "paid",
//         customer: ["Arrias Liunda", { image: "A" }],
//         product: "Airpods 2 Gen",
//         revenue: "$350,00",
//       },
//       {
//         id: "#10429",
//         date: "2 Nov, 10:14 AM",
//         status: "paid",
//         customer: ["Rugna Ilpio"],
//         product: "Bracelet Warret",
//         revenue: "$15,00",
//       },
//       {
//         id: "#10430",
//         date: "2 Nov, 10:14 AM",
//         status: "refunded",
//         customer: ["Anna Landa"],
//         product: ["Watter Bottle India", { suffix: "x 3" }],
//         revenue: "$25,00",
//       },
//       {
//         id: "#10431",
//         date: "2 Nov, 3:12 PM",
//         status: "paid",
//         customer: ["Karl Innas", { image: "K" }],
//         product: "Kitchen Gadgets",
//         revenue: "$164,90",
//       },
//       {
//         id: "#10432",
//         date: "2 Nov, 5:12 PM",
//         status: "paid",
//         customer: ["Oana Kilas", { image: "O", color: "info" }],
//         product: "Office Papers",
//         revenue: "$23,90",
//       },
//     ],
//   };

//   return (
//     <React.Fragment>
//       {/* <Box align="end" mb={1}>
//         <Button
//           onClick={() => setOpenAddContactModal(true)}
//           variant="contained"
//         >
//           <AddIcon /> Add Contact
//         </Button>
//       </Box> */}

//       {/* <AddContact open={openAddContactModal} setOpen={setOpenAddContactModal} /> */}
//       {/* <Card>
//         <MDBox p={3} lineHeight={1}>
//           <MDTypography variant="h5" fontWeight="medium">
//             Datatable Search
//           </MDTypography>
//           <MDTypography variant="button" color="text">
//             A lightweight, extendable, dependency-free javascript HTML table
//             plugin.
//           </MDTypography>
//         </MDBox>
//         <DataTable table={dataTableData} canSearch />
//       </Card> */}
//       {/* <CustomTable
//         columns={columns}
//         data={contacts}
//         title="Contacts"
//         downloadName="contacts"
//       /> */}
//       {/* <CustomModal
//         open={open}
//         onClose={() => setOpen(false)}
//         title="More Contact Details"
//       >
//         <ModalContent contact={contacts[index]} />
//       </CustomModal> */}
//     </React.Fragment>
//   );
// };

// export default Contacts;

// const ModalContent = ({ contact }) => {
//   const columns = [
//     { title: "Name", field: "name" },
//     { title: "Email", field: "email" },
//     { title: "Phone No.", field: "phoneNo" },
//     {
//       title: "Company",
//       field: "company",
//     },
//     { title: "Last Activity", field: "lastActivity" },
//     { title: "Lead Status", field: "leadStatus" },
//     { title: "Created At", field: "createdAt" },
//   ];

//   return (
//     <React.Fragment>
//       <CustomBasicHorizontalTable columns={columns} data={contact} />
//     </React.Fragment>
//   );
// };

// function DefaultCell({ children }) {
//   return (
//     <MDTypography variant="button" fontWeight="regular" color="text">
//       {children}
//     </MDTypography>
//   );
// }

// function IdCell({ id, checked }) {
//   return (
//     <MDBox display="flex" alignItems="center">
//       <Checkbox defaultChecked={checked} />
//       <MDBox ml={1}>
//         <MDTypography variant="caption" fontWeight="medium" color="text">
//           {id}
//         </MDTypography>
//       </MDBox>
//     </MDBox>
//   );
// }

// function StatusCell({ icon, color, status }) {
//   return (
//     <MDBox display="flex" alignItems="center">
//       <MDBox mr={1}>
//         <MDButton
//           variant="outlined"
//           color={color}
//           size="small"
//           iconOnly
//           circular
//         >
//           <Icon sx={{ fontWeight: "bold" }}>{icon}</Icon>
//         </MDButton>
//       </MDBox>
//       <MDTypography
//         variant="caption"
//         fontWeight="medium"
//         color="text"
//         sx={{ lineHeight: 0 }}
//       >
//         {status}
//       </MDTypography>
//     </MDBox>
//   );
// }

// function CustomerCell({ image, name, color }) {
//   return (
//     <MDBox display="flex" alignItems="center">
//       <MDBox mr={1}>
//         <MDAvatar bgColor={color} src={image} alt={name} size="xs" />
//       </MDBox>
//       <MDTypography
//         variant="caption"
//         fontWeight="medium"
//         color="text"
//         sx={{ lineHeight: 0 }}
//       >
//         {name}
//       </MDTypography>
//     </MDBox>
//   );
// }

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React from "react";

const Contacts = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  return (
    <DataGrid
      slots={{ toolbar: GridToolbar }}
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
};

export default Contacts;
