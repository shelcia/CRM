import React from "react";
import MUIDataTable from "mui-datatables";

const CustomTable = ({
  columns,
  data,
  title = "Table",
  downloadName = "file",
}) => {
  const options = {
    filter: true,
    filterType: "dropdown",
    responsive: "standard",
  };

  return (
    <React.Fragment>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
        downloadOptions={{ filename: downloadName }}
      />
    </React.Fragment>
  );
};

export default CustomTable;
