import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { FormControl, FormControlLabel, FormGroup } from "@material-ui/core";

const CustomCheckbox = ({ label, name, className, onChange, checked }) => {
  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              className={className}
              checked={checked}
              onChange={event => onChange(event, name)}
            />
          }
          label={label}
        />
      </FormGroup>
    </FormControl>
  );
};

export default CustomCheckbox;
