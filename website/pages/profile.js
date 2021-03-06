import { useState } from "react";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Layout from "../components/layout";
import Typography from "@material-ui/core/Typography";
import withAuth from "../lib/auth";
import Tooltip from "@material-ui/core/Tooltip";
import { useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios, { cancelRequest } from "../lib/axios";
import { Essays } from "./essays";

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function getStatus({ reviewerUID, isReviewComplete }) {
  if (isReviewComplete) return "complete";
  if (reviewerUID && !isReviewComplete) return "notComplete";
  return "noReviewer";
}

function splitEssays(essays) {
  essays.forEach(essay => {
    essay.status = getStatus(essay);
  });
  const { complete, notComplete, noReviewer } = groupBy(essays, "status");
  return {
    complete,
    notComplete,
    noReviewer
  };
}

function TabContainer({ essays, user }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <Essays essays={essays} user={user} />
    </div>
  );
}

TabContainer.propTypes = {
  essays: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};

function EssayTabs({ user, essays }) {
  const [value, setValue] = useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  function handleChangeIndex(index) {
    setValue(index);
  }
  const { complete = [], notComplete = [], noReviewer = [] } = splitEssays(essays);
  return (
    <div style={{ backgroundColor: "white", width: "calc(100vw - 47px)" }}>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} textColor="primary" indicatorColor="primary">
          <Tab label="Awaiting reviewer" />
          <Tab label="Not Yet Completed" />
          <Tab label="Completed" />
        </Tabs>
      </AppBar>
      <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
        <TabContainer essays={noReviewer} user={user} />
        <TabContainer essays={notComplete} user={user} />
        <TabContainer essays={complete} user={user} />
      </SwipeableViews>
    </div>
  );
}

function useProfile(user) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (user) {
      axios()
        .get(`/api/users/${user.uid}/profile`)
        .then(res => setProfile(res.data.profile));
    } else setProfile(null);
    return () => axios.cancelToken;
  }, [user]);
  return profile;
}

function Profile({ user, classes, handleLogin, handleLogout }) {
  const profile = useProfile(user);
  return (
    <Layout
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      user={user}
      signInRequired={true}
      signInVisible={true}
      message="You need to signin to access your profile"
    >
      <div>
        {user && profile && (
          <>
            <Grid container direction="column" justify="center" alignItems="center" spacing={16}>
              <Grid item xs={12}>
                <Avatar alt={user.name} src={user.picture} className={classes.avatar} />
                <Paper className={classes.paper}>
                  <Grid container spacing={16} justify="center" alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">{user.name}</Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        {user.email}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider variant="middle" />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">essays posted</Typography>
                      <Typography variant="h4">{profile.essaysPosted.length}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">essays reviewed</Typography>
                      <Typography variant="h4">{profile.essaysReviewedCount}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography color="textSecondary">points</Typography>
                      <Tooltip title="You earn points based on the number of essays you review and the ratings you receive. Top reviewers are listed on the home page!">
                        <Typography variant="h4">
                          {profile.points}
                          <span className={classes.stars}>✨</span>
                        </Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={16}>
              {profile.essaysReviewing.length > 0 && (
                <Grid item>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Essays that you're still reviewing
                  </Typography>
                  <Essays user={user} essays={profile.essaysReviewing} />
                </Grid>
              )}

              {profile.essaysPosted.length > 0 && (
                <Grid item id="posted">
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Essays that you've posted for feedback
                  </Typography>
                  <EssayTabs user={user} essays={profile.essaysPosted} />
                </Grid>
              )}
            </Grid>
          </>
        )}
      </div>
    </Layout>
  );
}

Profile.propTypes = {
  user: PropTypes.object,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const styles = theme => ({
  avatar: {
    margin: theme.spacing.unit,
    width: 120,
    height: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  paper: {
    padding: theme.spacing.unit,
    textAlign: "center"
  },
  stars: {
    fontSize: "1rem",
    verticalAlign: "middle",
    color: "transparent",
    textShadow: `0 0 0 ${theme.palette.secondary.main}`
  }
});

export default withStyles(styles)(withAuth(Profile));
