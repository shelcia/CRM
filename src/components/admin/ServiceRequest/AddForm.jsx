import React from "react";

const AddForm = ({
  setTitle,
  setClient,
  setManager,
  setClosing,
  setPriority,
  setStatus,
  setProb,
  setRevenue,
  addServiceRequest,
}) => {
  return (
    <React.Fragment>
      <div className="add-form">
        <input
          type="text"
          name="title"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="client"
          placeholder="client"
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          type="text"
          name="manager"
          placeholder="manager"
          onChange={(e) => setManager(e.target.value)}
        />
        <input
          type="date"
          name="closing"
          placeholder="closing"
          onChange={(e) => setClosing(e.target.value)}
        />
        <input
          type="text"
          name="priority"
          placeholder="priority"
          onChange={(e) => setPriority(e.target.value)}
        />
        <input
          type="text"
          name="status"
          placeholder="status"
          onChange={(e) => setStatus(e.target.value)}
        />
        <input
          type="text"
          name="probability"
          placeholder="probability"
          onChange={(e) => setProb(e.target.value)}
        />
        <input
          type="text"
          name="revenue"
          placeholder="revenue"
          onChange={(e) => setRevenue(e.target.value)}
        />
        <button onClick={(e) => addServiceRequest(e)}>
          Add Service Request
        </button>
      </div>
    </React.Fragment>
  );
};

export default AddForm;
