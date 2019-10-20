import React from "react";
import { makeStyles, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
    color: props => props.color || "white"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  }
}));

const CircularIndeterminate = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

export default CircularIndeterminate;
