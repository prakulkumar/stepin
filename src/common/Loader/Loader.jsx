import React from "react";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
    color: "white"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  }
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}
