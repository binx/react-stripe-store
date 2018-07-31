import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
  hamburger: {
    flex: 1,
    textAlign: "right"
  },
  hamburgerButton: {
    textDecoration: "none",
    width: "100%"
  },
});

class BannerHamburger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  toggleMenu = (open) => {
    this.setState({ open });
  }

  render() {
    const { classes } = this.props;
    return (
      <span className={classes.hamburger}>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon onClick={() => this.toggleMenu(true)} />
        </IconButton>
        <SwipeableDrawer anchor="right"
          open={this.state.open}
          onClose={() => this.toggleMenu(false)}
          onOpen={() => this.toggleMenu(true)}
        >
          <List style={{ width: "200px" }}>
            <ListItem>
              <Link to={`/`} className={classes.hamburgerButton}
                onClick={() => this.toggleMenu(false)}
              >
                <Typography variant="button" gutterBottom>Home</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <span onClick={() => this.toggleMenu(false)} 
                style={{ display: "flex", width: "100%" }}
              >
                { this.props.productLink }
              </span>
            </ListItem>
            <ListItem>
              <Link to={`/cart`} className={classes.hamburgerButton}
                onClick={() => this.toggleMenu(false)}
              >
                <Typography variant="button" gutterBottom>Cart{this.props.number}</Typography>
              </Link>
            </ListItem>
          </List>
        </SwipeableDrawer>
      </span>
    );
  }
};
export default withStyles(styles)(BannerHamburger);