import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Link from "next/link";

const Index = ({ classes }) => (
  <div className={classes.root}>
    <Grid container style={{ minHeight: `calc(100vh - 96px)` }} justify="space-around" alignItems="center" direction="column">
      <Grid item>
        <Typography align="center" variant="h4" gutterBottom>
          Get feedback for your essay - for Free!
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={16} alignItems="center" justify="center">
          <Grid item>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom className={classes.uppercase}>
                writer
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Post your essay to get feedback
              </Typography>
              <Link href="/post" passHref prefetch>
                <Button variant="contained" color="primary" className={classes.button}>
                  post essay
                </Button>
              </Link>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>
              <Typography variant="h6" gutterBottom className={classes.uppercase}>
                reviewer
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Choose an essay to give feedback
              </Typography>
              <Link href="/essays" passHref prefetch>
                <Button color="secondary" className={classes.button}>
                  go to essays
                </Button>
              </Link>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.marginTop}>
        <Typography align="center" variant="h6" gutterBottom>
          Your essay is private and protected
        </Typography>
        <Typography align="center" gutterBottom>
          We use sharing links from Google docs to protect your work. Your essay is only shared with reviewers.
        </Typography>
      </Grid>
      <Grid item className={classes.marginTop}>
        <Typography align="justify" variant="caption" gutterBottom>
          "Essayfeedback is what I wish I had during my college applications" - Samuel, co-founder.
        </Typography>
      </Grid>
    </Grid>
  </div>
);

const styles = theme => ({
  uppercase: {
    textTransform: "uppercase"
  },
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing.unit
  },
  finePrint: {
    fontSize: "0.8rem"
  },
  marginTop: {
    marginTop: theme.spacing.unit * 3
  }
});

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  width: PropTypes.string
};

export default withStyles(styles)(Index);
