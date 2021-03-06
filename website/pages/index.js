import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import NextLink from "next/link";
import withAuth from "../lib/auth";
import Link from "@material-ui/core/Link";
import Layout from "../components/layout";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import axios, { cancelRequest } from "../lib/axios";

function usePoints(user) {
  const [points, setPoints] = useState(0);
  useEffect(() => {
    if (user)
      axios()
        .get(`/api/users/${user.uid}/points`)
        .then(res => setPoints(res.data.points));
    else setPoints(0);
    return cancelRequest;
  }, [user]);
  return points;
}

function Index({ classes, handleLogin, handleLogout, user }) {
  const points = usePoints(user);
  return (
    <Layout handleLogin={handleLogin} handleLogout={handleLogout} user={user} signInRequired={false} signInVisible={false} message="">
      <Grid container style={{ minHeight: `calc(100vh - 96px)` }} justify="space-around" alignItems="center" direction="column">
        <Grid item className={classes.marginTop}>
          <Typography align="center" variant="h3" style={{ fontWeight: 300 }}>
            Get feedback for your essay - for Free!
          </Typography>
        </Grid>

        {user && (
          <Grid item className={classes.marginTop} style={{ minWidth: 240 }}>
            <Paper className={classes.paper2}>
              <Grid container>
                <Grid item xs={4}>
                  <Avatar alt={user.name} src={user.picture} className={classes.avatar} />
                </Grid>
                <Grid item xs={8}>
                  <Typography color="textSecondary">Welcome back</Typography>
                  <Typography variant="body1">{user.name}</Typography>
                  <Typography variant="body2">
                    <span style={{ fontWeight: 700 }}>{points}</span> points <span className={classes.stars}>✨</span>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        <Grid item className={classes.marginTop}>
          <Grid container spacing={16} alignItems="center" justify="center">
            <Grid item style={{ minWidth: 320 }}>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom className={classes.uppercase}>
                  writer
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Post your essay to get feedback
                </Typography>
                <NextLink href="/post" prefetch>
                  <Link href="/post" variant="button" color="primary" className={classes.link}>
                    post essay
                  </Link>
                </NextLink>
              </Paper>
            </Grid>
            <Grid item style={{ minWidth: 320 }}>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom className={classes.uppercase}>
                  reviewer
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Choose an essay to give feedback
                </Typography>
                <NextLink href="/essays" prefetch>
                  <Link href="/essays" color="secondary" variant="button" className={classes.link}>
                    go to essays
                  </Link>
                </NextLink>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {!user && (
          <Grid item className={classes.marginTop}>
            <Button className={classes.link} variant="contained" size="large" onClick={handleLogin}>
              Join Essayfeedback
            </Button>
          </Grid>
        )}

        <Grid item className={classes.marginTop}>
          <div style={{ marginBottom: 24 }}>
            <Typography align="center" variant="h6" gutterBottom>
              Your work is private and protected
            </Typography>
            <Typography align="center" gutterBottom>
              We use sharing links from Google Docs to protect your essay. Your essay is only shared with reviewers.
            </Typography>
          </div>

          <div>
            <Typography align="center" variant="caption" gutterBottom>
              "Essayfeedback is what I wish I had during my college applications" - Samuel, co-founder.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
}

const styles = theme => ({
  uppercase: {
    textTransform: "uppercase"
  },
  stars: {
    fontSize: "1rem",
    verticalAlign: "middle",
    color: "transparent",
    textShadow: `0 0 0 ${theme.palette.secondary.main}`
  },
  paper2: {
    padding: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "center"
  },
  link: {
    margin: theme.spacing.unit
  },
  marginTop: {
    marginTop: theme.spacing.unit * 3
  },
  avatar: {
    width: 60,
    height: 60
  },
  join: {
    marginRight: theme.spacing.unit
  }
});

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default withStyles(styles)(withAuth(Index));
