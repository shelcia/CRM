import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import {
  RiAddLine,
  RiCheckLine,
  RiFilter3Line,
  RiDownloadLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiCloseLine,
  RiDeleteBin5Line,
  RiEyeLine,
  RiSearch2Line,
  RiPencilLine,
  RiSpeedMiniLine,
  RiRewindMiniLine,
  RiCheckboxCircleLine,
  RiArrowDownLine,
} from "react-icons/ri";

const CustomTable = ({ columns, data, title }) => {
  const tableIcons = {
    Add: forwardRef((props, ref) => <RiAddLine />),
    Check: forwardRef((props, ref) => <RiCheckLine />),
    Clear: forwardRef((props, ref) => <RiCloseLine />),
    Delete: forwardRef((props, ref) => <RiDeleteBin5Line />),
    DetailPanel: forwardRef((props, ref) => <RiArrowRightSLine />),
    Edit: forwardRef((props, ref) => <RiPencilLine />),
    Export: forwardRef((props, ref) => <RiDownloadLine />),
    Filter: forwardRef((props, ref) => (
      <RiFilter3Line strokeWidth={1.5} width={15} />
    )),
    FirstPage: forwardRef((props, ref) => <RiRewindMiniLine />),
    LastPage: forwardRef((props, ref) => <RiSpeedMiniLine />),
    NextPage: forwardRef((props, ref) => <RiArrowRightSLine />),
    PreviousPage: forwardRef((props, ref) => <RiArrowLeftSLine />),
    ResetSearch: forwardRef((props, ref) => <RiCloseLine />),
    Search: forwardRef((props, ref) => (
      <RiSearch2Line strokeWidth={1.5} width={18} />
    )),
    SortArrow: forwardRef((props, ref) => <RiArrowDownLine />),
    ThirdStateCheck: forwardRef((props, ref) => <RiCheckboxCircleLine />),
    ViewColumn: forwardRef((props, ref) => <RiEyeLine />),
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
