import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";

import AdminTable from './AdminTable';
import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

function Admin(props) {
  const [viewStatus, setViewStatus] = useState("paid");
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [shipping, setShipping] = useState([]);

  useEffect(() => {
    getOrders(viewStatus);
  }, [])

  const getOrders = status => {
    fetch('/orders/' + status, {
        credentials: 'same-origin',
      }).then(res => {
        if (res.redirected)
          props.history.push('/login');
        else
          return res.json();
      })
      .then(results => {
        if (!results) return;

        if (results.error) {
          logout();
        } else {
          const newStatuses = results.map(o => o.metadata.status || "Ordered");
          const newShipping = results.map(o => "");
          setOrders(results);
          setStatuses(newStatuses);
          setShipping(newShipping);
        }
      });
  }

  const logout = () => {
    fetch('/api/logout', {
      credentials: 'same-origin',
    }).then(res => {
      props.history.push('/login');
    })
  }

  const switchView = (event, view_status) => {
    setViewStatus(view_status)
    getOrders(view_status);
  }

  const updateStatus = (i, status) => {
    let newStatuses = [...statuses];
    newStatuses[i] = status;
    setStatuses(newStatuses);
  }

  const updateShipping = (i, tracking) => {
    let newShipping = [...shipping];
    newShipping[i] = tracking;
    setShipping(newShipping);
  }

  const updateOrder = index => {
    const order = orders[index],
      status = statuses[index];

    if (status === "Shipped") {
      const tracking = shipping[index];
      fetch("/order/ship/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            id: order.id,
            status: status,
            tracking: tracking
          })
        }).then((response) => response.json())
        .then((json) => {
          let newOrders = [...orders];
          newOrders[index] = json;
          setOrders(newOrders);
        });
    } else {
      fetch("/order/update/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            id: order.id,
            status: status
          })
        }).then((response) => response.json())
        .then((json) => {
          let newOrders = [...orders];
          newOrders[index] = json;
          setOrders(newOrders)
        });
    }
  }

  return (
    <PageWrapper>
      <Paper style={{ position: "relative "}}>
        <Button color="primary" onClick={logout}
          style={{ position: "absolute", right: "20px", top: "10px", zIndex: "1" }}
        >Logout</Button>
        <AdminTable 
          view_status={viewStatus}
          orders={orders}
          statuses={statuses}
          shipping={shipping}
          updateOrder={updateOrder}
          updateShipping={updateShipping}
          updateStatus={updateStatus}
          switchView={switchView}
        />
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(Admin);