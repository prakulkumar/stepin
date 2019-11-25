import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  panelHeader: {
    backgroundColor: "#bdbdbd"
  },
  panel: {
    width: "100%",
    margin: "5% auto 8% auto"
  },
  button: {
    textAlign: "right"
  },
  buttonSec: {
    marginRight: 20
  },
  expansionPanelDetails: {
    display: "block"
  },
  expansionPanelSummary: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  panelLabel: {
    flexGrow: 1
  },
  panelIcon: {
    marginLeft: 20
  },
  deleteButton: {
    marginTop: 20
  },
  formHeader: {
    flexGrow: 1
  },
  formTitle: {
    flexGrow: 1
  },
  datePicker: {
    width: "100%",
    marginRight: 8,
    marginLeft: 8
  }
}));
