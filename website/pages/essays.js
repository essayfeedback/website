import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import axios from "../lib/axios";
import Essay, { essayPropTypes } from "../components/essay";
import { getSelectedAreas, getSelectedStage } from "../pages/post";
import Layout from "../components/layout";
import withAuth from "../lib/auth";

Object.assign(essayPropTypes, {
  selectedAreas: PropTypes.arrayOf(PropTypes.bool).isRequired,
  selectedStage: PropTypes.number.isRequired
});

const formatEssays = essays =>
  essays.map(({ selectedStage, selectedAreas, question, link, ownerUID, reviewerUID, isReviewComplete, _id }) => ({
    areas: getSelectedAreas(selectedAreas),
    stage: getSelectedStage(selectedStage),
    question,
    link,
    ownerUID,
    reviewerUID,
    isReviewComplete,
    id: _id
  }));

export const Essays = ({ essays, user }) => (
  <Grid container spacing={16} style={{ paddingTop: 16, paddingBottom: 16 }}>
    {formatEssays(essays).map((essay, idx) => (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
        <Essay essay={essay} user={user} />
      </Grid>
    ))}
  </Grid>
);

Essays.propTypes = {
  essays: PropTypes.arrayOf(essayPropTypes).isRequired,
  user: PropTypes.object
};

const EssaysWithLayout = ({ essays, user, handleLogin, handleLogout, classes: { text } }) => (
  <Layout
    handleLogin={handleLogin}
    handleLogout={handleLogout}
    user={user}
    signInRequired={false}
    signInVisible={true}
    message="You need to sign in to review an essay"
  >
    <Typography variant="subtitle1" className={text}>
      1. Click "Review" to select an essay for feedback.
    </Typography>
    <Typography variant="subtitle1" className={text}>
      2. Click "Open" to start adding comments via Google Docs
    </Typography>
    <Typography variant="subtitle1" className={text}>
      3. When you're done, click "Complete" to notify the owner you've finished.
    </Typography>
    <Essays essays={essays} user={user} />
  </Layout>
);

EssaysWithLayout.getInitialProps = async function getInitialProps() {
  const {
    data: { essays }
  } = await axios().get(`/api/essays`);
  return { essays: essays };
};

const styles = {
  text: {
    color: "#424242"
  }
};

EssaysWithLayout.propTypes = {
  essays: PropTypes.arrayOf(essayPropTypes).isRequired,
  user: PropTypes.object,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withAuth(EssaysWithLayout));
