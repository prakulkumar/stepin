import React from "react";
import { Card, CardContent, CardActions } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    maxWidth: props => props.maxWidth || 275,
    margin: props => props.margin || "0 auto"
  }
});

const CustomCard = ({ header, content, actions, ...props }) => {
  const classes = useStyles(props);

  return (
    <Card className={classes.card}>
      {header && header}
      {content && <CardContent>{content}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

export default CustomCard;
