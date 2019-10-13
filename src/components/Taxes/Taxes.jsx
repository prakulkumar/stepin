import React, { useEffect, useState } from "react";
import taxService from "../../services/taxService";

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  inputItems: {
    width: "70%"
  },
  span: {
    color: "#f50057"
  }
}));

const Taxes = ({ onClose }) => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const taxSlabs = await taxService.getTaxSlabs();
      setTaxSlabs(taxSlabs);
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <DialogTitle>Tax Slabs</DialogTitle>
      <DialogContent>
        {taxSlabs.map(taxInfo => (
          <div key={taxInfo._id} className={classes.formGroup}>
            <Typography
              display={"block"}
              nowrap={"true"}
              className={classes.inputItems}
            >
              Greater Than{" "}
              {<span className={classes.span}>{taxInfo.greaterThan}</span>}{" "}
              {taxInfo.lessThanAndEqual ? "and less than equal to " : ""}
              {taxInfo.lessThanAndEqual && (
                <span className={classes.span}>{taxInfo.lessThanAndEqual}</span>
              )}
            </Typography>
            <Typography>:</Typography>
            <Typography>{`${taxInfo.taxPercent}%`}</Typography>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Taxes;
