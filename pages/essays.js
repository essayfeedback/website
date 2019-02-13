import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Essay, { essayPropTypes } from "../components/essay";
import { getSelectedAreas, getSelectedStage } from "../pages/post";
import Layout from "../components/layout";
import withAuth from "../lib/auth";
import APIEndpoint from "../lib/api";

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

const EssaysWithLayout = ({ essays, user, handleLogin, handleLogout }) => (
  <Layout
    handleLogin={handleLogin}
    handleLogout={handleLogout}
    user={user}
    signInRequired={false}
    signInVisible={true}
    message="You need to sign in to review an essay"
  >
    <Essays essays={essays} user={user} />
  </Layout>
);

EssaysWithLayout.getInitialProps = async function getInitialProps() {
  const {
    data: { essays }
  } = await axios.get(`${APIEndpoint}/essays`);
  return { essays: essays };
};

EssaysWithLayout.propTypes = {
  essays: PropTypes.arrayOf(essayPropTypes).isRequired,
  user: PropTypes.object,
  handleLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default withAuth(EssaysWithLayout);
