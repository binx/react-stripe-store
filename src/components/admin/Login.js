import React, { useState } from 'react';
import { withRouter } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

function Login(props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const logUserIn = () => {
    setError(null)
    fetch('/api/login', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ password })
      })
      .then(res => {
        if (res.redirected)
          props.history.push('/admin');
        else
          return res.json();
      })
      .then(json => {
        if (!json) return;
        else if (json.error)
          setError(json.error.message)
      });
  }

  return (
    <PageWrapper>
      <Paper>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ marginRight: "10px" }}>password:</span>
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button variant="contained" color="primary" 
            onClick={logUserIn}
          >log in</Button>
          <div style={{ marginTop: "20px" }}>{error}</div>
        </div>
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(Login);