import React from "react";
import Card from "../../common/Card/Card";
import ReportBody from "./ReportBody";
import ReportHeader from "./ReportHeader";

import "./Report.scss";

const Report = ({ selectedBooking: booking, history }) => {
  if (booking === null) history.replace("/");

  return (
    booking && (
      <Card
        header={<ReportHeader />}
        content={<ReportBody booking={booking} />}
        maxWidth={700}
        margin="40px auto"
      />
    )
  );
};

export default Report;
