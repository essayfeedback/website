import { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getAreas } from "../pages/post";

const areas = getAreas();
const formatAreas = checked => checked.map((bool, idx) => (bool ? areas[idx] : "")).filter(elem => elem !== "");

function Essay({ stage, areas, question, link, classes }) {
  return (
    <Card className={classes.card} style={{ height: "100%" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Stage
        </Typography>
        <Typography variant="body1" gutterBottom>
          {stage}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Areas
        </Typography>
        {formatAreas(areas).map((area, idx) => (
          <Typography key={idx} component="p" gutterBottom={idx === areas.length - 1}>
            {`${idx + 1}. ${area}`}
          </Typography>
        ))}
        {question && (
          <Fragment>
            <Typography color="textSecondary">Question</Typography>
            <Typography>{question}</Typography>
          </Fragment>
        )}
      </CardContent>
      <CardActions className={classes.action}>
        <Button href={link} target="_blank" rel="noreferrer" color="secondary">
          review
        </Button>
      </CardActions>
    </Card>
  );
}

const styles = () => ({
  card: {
    minWidth: 120
  },
  actions: {
    display: "flex"
  }
});

Essay.propTypes = {
  question: PropTypes.string,
  stage: PropTypes.string.isRequired,
  areas: PropTypes.arrayOf(PropTypes.bool).isRequired,
  link: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Essay);
