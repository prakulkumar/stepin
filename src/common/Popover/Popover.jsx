import React from "react";
import { makeStyles, Typography, Popover } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  typography: {
    fontSize: 13.3333,
    fontWeight: 600
  },
  popover: {
    pointerEvents: "none"
  },
  paper: {
    padding: theme.spacing(1)
  }
}));

const MouseOverPopover = ({ content, popoverContent }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handlePopoverOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.typography}
      >
        {content}
      </Typography>
      {popoverContent && (
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography>{popoverContent}</Typography>
        </Popover>
      )}
    </div>
  );
};

export default MouseOverPopover;
