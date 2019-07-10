import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector } from "reselect";
import * as s from "../selectors";
import { connect } from "react-redux";
// Components
import Card from "components/Card";
// Actions
import { fetchAllDappnodeStatus } from "services/dappnodeStatus/actions";
// Icon
import Ok from "components/Ok";
// Styles
import "./support.css";

function AutoDiagnose({ diagnoses, fetchAllDappnodeStatus }) {
  useEffect(() => {
    fetchAllDappnodeStatus(); // = componentDidMount
  }, [fetchAllDappnodeStatus]);

  return (
    <Card>
      {diagnoses.map(({ loading, ok, msg, solutions }, i) => (
        <div key={i}>
          <Ok {...{ msg, ok, loading }} />
          {!ok && !loading && solutions ? (
            <ul>
              {solutions.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </Card>
  );
}

AutoDiagnose.propTypes = {
  diagnoses: PropTypes.array.isRequired
};

// Container

const mapStateToProps = createStructuredSelector({
  diagnoses: s.getDiagnoses
});

// Uses bindActionCreators to wrap action creators with dispatch
const mapDispatchToProps = { fetchAllDappnodeStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoDiagnose);
