import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  posInfoContainer: {
    padding: "20px 24px 8px 24px"
  },
  posInfoSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  }
}));

const PosInfo = ({ posInformation }) => {
  const classes = useStyles();

  console.log(posInformation);
  return (
    <div className={classes.posInfoContainer}>
      {posInformation &&
        Object.keys(posInformation).map(key => (
          <div key={key}>
            <Typography variant="subtitle1" component="span">
              h1. Heading
            </Typography>
            <div className={classes.posInfoSection}>POS Info</div>
          </div>
        ))}
    </div>
  );
};

export default PosInfo;
