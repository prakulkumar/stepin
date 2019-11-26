import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  fontWeightBold: {
    fontWeight: 'bold',
    padding: '10px 0'
  },
  posInfoContainer: {
    padding: '20px 24px 8px 24px'
  },
  posInfoSection: {
    display: 'grid',
    gridTemplateColumns: '0.7fr 1fr 1fr'
  }
}));

const PosInfo = ({ posInformation }) => {
  const classes = useStyles();

  console.log(posInformation);
  return (
    <div className={classes.posInfoContainer}>
      <div className={classes.posInfoSection}>
        <div className={classes.fontWeightBold}>POS</div>
        <div className={classes.fontWeightBold}>Amount</div>
        <div className={classes.fontWeightBold}>Remarks</div>
      </div>
      {posInformation &&
        Object.keys(posInformation).map(key => (
          <div key={key}>
            <div className={classes.posInfoSection}>
              {posInformation[key].map(prosInfo => (
                <>
                  <Typography variant='subtitle1' component='span'>
                    {key}
                  </Typography>
                  <div>&#8377; {prosInfo.amount}</div>
                  <div>{prosInfo.remarks}</div>
                </>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default PosInfo;
