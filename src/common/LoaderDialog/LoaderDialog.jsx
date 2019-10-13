import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Loader from "../Loader/Loader";

const useStyles = makeStyles({
  dialog: {
    boxShadow: "none",
    backgroundColor: "transparent",
    width: "20%",
    height: "20%"
  }
});

export default function LoaderDialog(props) {
  const classes = useStyles();
  const { open } = props;

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={open}
      PaperProps={{ className: classes.dialog }}
    >
      <Loader />
    </Dialog>
  );
}
