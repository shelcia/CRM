import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import {
  Plus,
  Check,
  X,
  Trash,
  ChevronRight,
  ChevronLeft,
  ChevronsDown,
  Edit2,
  Save,
  Filter,
  Search,
  XCircle,
  Eye,
  ChevronsLeft,
  ChevronsRight,
} from "react-feather";

const CustomTable = ({ columns, data, title }) => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <Plus {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <X {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <Trash {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit2 {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <Save {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => (
      <Filter {...props} ref={ref} strokeWidth={1.5} width={15} />
    )),
    FirstPage: forwardRef((props, ref) => (
      <ChevronsLeft {...props} ref={ref} />
    )),
    LastPage: forwardRef((props, ref) => (
      <ChevronsRight {...props} ref={ref} />
    )),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <X {...props} ref={ref} />),
    Search: forwardRef((props, ref) => (
      <Search {...props} ref={ref} strokeWidth={1.5} width={18} />
    )),
    SortArrow: forwardRef((props, ref) => (
      <ChevronsDown {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <XCircle {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <Eye {...props} ref={ref} />),
  };

  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons}
        columns={columns}
        data={data}
        title={title}
        options={{
          filtering: true,
          sorting: true,
          grouping: true,
          exportButton: true,
          headerStyle: {
            backgroundColor: "#3358f4",
            background: "linear-gradient(90deg, #3358f4, #1d8cf8)",
            color: "#FFF",
            backgroundRepeat: "no-repeat",
            textTransform: "uppercase",
          },
          rowStyle: (rowData) => ({
            backgroundColor: "rgb(0,0,0,0)",
          }),
        }}
      />
    </React.Fragment>
  );
};

export default CustomTable;
