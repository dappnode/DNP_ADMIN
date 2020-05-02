import React, { useEffect } from "react";
import * as s from "../selectors";
import { useSelector, useDispatch } from "react-redux";
// Components
import Card from "components/Card";
// Actions
import { fetchAllDappnodeStatus } from "services/dappnodeStatus/actions";
// Icon
import Ok from "components/Ok";
// Styles
import "./support.css";

export default function AutoDiagnose() {
  const diagnoses = useSelector(s.getDiagnoses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDappnodeStatus()); // = componentDidMount
  }, [dispatch]);

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
