import React, { useContext } from "react";
import CheckboxGroup from "./CheckboxGroup";
import { SecondAxisContext } from "../../store/contexts";
import { FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";

const SecondaryAxisCheckbox = ({ keys, name, value, labelText }) => {
  const [{ showSecondAxis, checkedState }, dispatch] =
    useContext(SecondAxisContext);

  const handleCheckboxChange = () => {
    dispatch({
      type: "SET_SECOND_AXIS",
      payload: !showSecondAxis,
    });

    dispatch({
      type: "UPDATE_CHECKED_STATE",
      payload: new Array(keys.length).fill(false),
    });
  };

  const handleCheckboxGroupChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    dispatch({
      type: "UPDATE_CHECKED_STATE",
      payload: updatedCheckedState,
    });
  };

  return (
    <>
      <FormGroup>
        <FormControlLabel
          name={name}
          value={value}
          label={labelText}
          checked={showSecondAxis}
          disabled={!keys.length}
          control={<Switch />}
          onChange={handleCheckboxChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </FormGroup>
      {showSecondAxis && (
        <>
          <Typography variant="subtitle2" gutterBottom component="div">
            Secondary Axis Data
          </Typography>
          <CheckboxGroup
            keys={keys}
            checkedState={checkedState}
            handleChange={handleCheckboxGroupChange}
          />
        </>
      )}
    </>
  );
};

export default SecondaryAxisCheckbox;
