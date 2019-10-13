import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: props => props.width || "100%"
  }
}));
