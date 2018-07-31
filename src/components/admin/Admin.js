import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import AdminTable from './AdminTable';
import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Admin extends Component {
  state = {
    view_status: "paid"
  };

  componentDidMount() {
    this.getOrders(this.state.view_status);
  }

  getOrders = (status) => {
    fetch('/orders/'+status, {
      credentials: 'same-origin',
    }).then(res => {
      if (res.redirected)
        this.props.history.push('/login');
      else 
        return res.json();
    })
    .then(orders => {
      if (!orders) return;

      if (orders.error) {
        this.logout();
      } else {
        const statuses = orders.map(o => o.metadata.status || "Ordered");
        const shipping = orders.map(o => "");
        this.setState({ orders, statuses, shipping });
      }
    });
  }

  logout = () => {
    fetch('/api/logout', { 
      credentials: 'same-origin',
    }).then(res => {
      this.props.history.push('/login');
    })
  }

  switchView = (event, view_status) => {
    this.setState({ view_status });
    this.getOrders(view_status);
  }

  updateStatus = (i, status) => {
    let statuses = [...this.state.statuses];
    statuses[i] = status;
    this.setState({ statuses })
  }

  updateShipping = (i, tracking) => {
    let shipping = [...this.state.shipping];
    shipping[i] = tracking;
    this.setState({ shipping }) 
  }

  updateOrder = (index) => {
    const { orders, statuses, shipping } = this.state;
    const order = orders[index],
      status = statuses[index];

    if (status === "Shipped") {
      const tracking = shipping[index];
      fetch("/order/ship/", {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          id: order.id,
          status: status,
          tracking: tracking
        })
      }).then((response) => response.json())
      .then((json) => {
        let orders = [...this.state.orders];
        orders[index] = json;
        this.setState({ orders });
      });
    } else {
      fetch("/order/update/", {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          id: order.id,
          status: status
        })
      }).then((response) => response.json())
      .then((json) => {
        let orders = [...this.state.orders];
        orders[index] = json;
        this.setState({ orders });
      });
    }
  }

  render() {
    const { view_status, orders = [], statuses = [], shipping = [] } = this.state;

    return (
      <PageWrapper>
        <Paper style={{ position: "relative "}}>
          <Button color="primary" onClick={this.logout}
            style={{ position: "absolute", right: "20px", top: "10px", zIndex: "1" }}
          >Logout</Button>
          <AdminTable 
            view_status={view_status}
            orders={orders}
            statuses={statuses}
            shipping={shipping}
            updateOrder={this.updateOrder}
            updateShipping={this.updateShipping}
            updateStatus={this.updateStatus}
            switchView={this.switchView}
          />
        </Paper>
      </PageWrapper>
    );
  }
};
export default withRouter(Admin);