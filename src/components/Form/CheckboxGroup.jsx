import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";

const CheckboxGroup = ({ keys, checkedState, handleChange }) => {
  return (
    <FormGroup row={true}>
      {keys.map((item, index) => {
        return (
          <FormControlLabel
            key={index}
            name={item}
            value={item}
            control={<Checkbox />}
            label={item}
            checked={checkedState[index]}
            onChange={() => handleChange(index)}
            inputprops={{ "aria-label": "controlled" }}
          />
        );
      })}
    </FormGroup>
  );
};

export default CheckboxGroup;
