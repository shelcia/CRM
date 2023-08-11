import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  // FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  styled,
  TextField,
} from "@mui/material";

const AuthTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color:
      theme.palette.mode === "light" ? "inherit" : "rgba(255, 255, 255, 0.6)",
  },
  "& label.Mui-focused": {
    color: "#e14eca",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#e14eca",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor:
        theme.palette.mode === "light" ? "rgba(34,42,66,.2)" : "#2b3553",
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "light" ? "rgba(34,42,66,.2)" : "#2b3553",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e14eca",
    },
  },
}));

export const CustomAuthInput = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  type = "text",
  props,
}) => {
  return (
    <AuthTextField
      fullWidth
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
      type={type}
      {...props}
    />
  );
};

export const CustomTextField = ({
  name,
  label = "",
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  color = "primary",
  type = "text",
  props,
}) => {
  return (
    <TextField
      fullWidth
      label={label === "" ? label : `Enter ${label}`}
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
      color={color}
      type={type}
      {...props}
    />
  );
};

export const CustomTextAreaField = ({
  name,
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  rows = 5,
}) => {
  return (
    <TextField
      fullWidth
      rows={rows}
      multiline
      name={name}
      size="small"
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
    />
  );
};

export const CustomSelectField = ({
  name,
  label = "",
  placeholder,
  values,
  handleChange,
  touched,
  errors,
  labelItms,
}) => {
  return (
    <TextField
      id={`select-${name}-id`}
      placeholder={placeholder}
      value={values[name]}
      onChange={handleChange}
      // renderValue={(value) => `⚠️  - ${value}`}
      select
      size="small"
      name={name}
      label={label === "" ? label : `Enter ${label}`}
      helperText={touched[name] && errors[name]}
      error={Boolean(touched[name] && errors[name])}
    >
      {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
      {labelItms.map((itm) => (
        <MenuItem value={itm.val} key={itm.val}>
          {itm.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

// export const CustomSelectChipField = ({
//   name,
//   label = "",
//   placeholder,
//   values,
//   handleChange,
//   touched,
//   errors,
//   labelItms,
// }) => {
//   const handleDelete = (e, value) => {
//     e.preventDefault();
//     console.log("clicked delete");
//   };

//   return (
//     <FormControl error={Boolean(touched[name] && errors[name])}>
//       <InputLabel htmlFor="component-outlined">{label}</InputLabel>
//       <Select
//         id={`select-${name}-id`}
//         placeholder={placeholder}
//         value={values[name]}
//         onChange={handleChange}
//         // renderValue={(value) => `⚠️  - ${value}`}
//         // select
//         size="small"
//         name={name}
//         // helperText={touched[name] && errors[name]}
//         error={Boolean(touched[name] && errors[name])}
//         renderValue={(selected) => (
//           <div>
//             {selected.map((value) => (
//               <Chip
//                 key={value}
//                 label={value}
//                 clickable
//                 deleteIcon={
//                   <CancelIcon
//                     onMouseDown={(event) => event.stopPropagation()}
//                   />
//                 }
//                 onDelete={(e) => handleDelete(e, value)}
//                 onClick={() => console.log("clicked chip")}
//               />
//             ))}
//           </div>
//         )}
//       >
//         {labelItms.map((itm) => (
//           <MenuItem value={itm.val} key={itm.val}>
//             {itm.label}
//           </MenuItem>
//         ))}
//       </Select>
//       <FormHelperText>{touched[name] && errors[name]}</FormHelperText>
//     </FormControl>
//   );
// };

// const names = [
//   "Humaira Sims",
//   "Santiago Solis",
//   "Dawid Floyd",
//   "Mateo Barlow",
//   "Samia Navarro",
//   "Kaden Fields",
//   "Genevieve Watkins",
//   "Mariah Hickman",
//   "Rocco Richardson",
//   "Harris Glenn",
// ];

export const CustomSelectChipField = ({
  name,
  label = "",
  placeholder,
  labelItms = [],
}) => {
  const [selectedNames, setSelectedNames] = useState([]);

  const handleDelete = (e) => {
    console.log(e.target);
  };
  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        size="small"
        multiple
        value={selectedNames}
        onChange={(e) => setSelectedNames(e.target.value)}
        input={<OutlinedInput label={label} size="small" />}
        renderValue={(selected) => (
          <Stack gap={1} direction="row" flexWrap="wrap">
            {selected.map((value) => (
              <Chip key={value} label={value} onDelete={handleDelete} />
            ))}
          </Stack>
        )}
      >
        {labelItms.map((itm) => (
          <MenuItem key={itm.val} value={itm.val}>
            {itm.label}
          </MenuItem>
        ))}
      </Select>
      {/* <FormHelperText>{touched[name] && errors[name]}</FormHelperText> */}
      {/* <FormHelperText error={true}>Error</FormHelperText> */}
    </FormControl>
  );
};

export const CustomMultipleCheckBoxField = ({
  label = "",
  labelItms = [],
  checked,
  setChecked,
}) => {
  return (
    <>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={(event) => {
              const reqArray = Array.from(
                { length: labelItms.length },
                () => event.target.checked
              );
              setChecked(reqArray);
            }}
          />
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {labelItms.map((itm, idx) => (
          <FormControlLabel
            key={idx}
            label={itm}
            control={
              <Checkbox
                checked={checked[idx]}
                onChange={(event) => {
                  let checkedArr = [...checked];
                  checkedArr[idx] = event.target.checked;
                  console.log(checkedArr, event.target);
                  setChecked(checkedArr);
                  console.log(checked);
                }}
              />
            }
          />
        ))}
      </Box>
    </>
  );
};
