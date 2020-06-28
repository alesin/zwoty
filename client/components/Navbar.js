import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

//#region    MATERIAL-UI imports
// import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
// import KitchenIcon from '@material-ui/icons/Kitchen'
// import LocalDiningIcon from '@material-ui/icons/LocalDining'
import RestaurantIcon from '@material-ui/icons/Restaurant'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import HistoryIcon from '@material-ui/icons/History'
import HotelIcon from '@material-ui/icons/Hotel'
// import NewReleasesIcon from '@material-ui/icons/NewReleases'
// import MoodBadIcon from '@material-ui/icons/MoodBad'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'
//#endregion

const useStyles = makeStyles(theme => ({
  // root: {
  //   flexGrow: 1
  // },
  appBar: {
    backgroundColor: '#d3b225'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBarLink: {
    color: 'white'
  },
  list: {
    width: 250
  }
}))

const Navbar = ({handleClick, isLoggedIn}) => {
  const classes = useStyles()
  const [state, setState] = React.useState({
    left: false
  })

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({...state, [anchor]: open})
  }

  const loggedInList = anchor => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <Typography variant="overline">JOURNAL</Typography>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Food" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FitnessCenterIcon />
          </ListItemIcon>
          <ListItemText primary="Exercise" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Habits" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HotelIcon />
          </ListItemIcon>
          <ListItemText primary="Sleep" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ScatterPlotIcon />
          </ListItemIcon>
          <ListItemText primary="Period" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem>
          <Typography variant="overline">ACCOUNT</Typography>
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  )

  const loggedOutList = anchor => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <Typography variant="overline">ACCOUNT</Typography>
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button component={Link} to="/signup">
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Signup" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer('left', true)}
        >
          {/* <Icon>menu</Icon> */}
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="left"
          open={state.left}
          onClose={toggleDrawer('left', false)}
        >
          {isLoggedIn ? loggedInList('left') : loggedOutList('left')}
        </Drawer>

        <Typography variant="h6" className={classes.title}>
          <Link to="/" className={classes.appBarLink}>
            Zwoty
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  )

  // <div>
  //   <nav>
  //     {isLoggedIn ? (
  //       <div>
  //         {/* The navbar will show these links after you log in */}
  //         <Link to="/home">Home</Link>
  //         <a href="#" onClick={handleClick}>
  //           Logout
  //         </a>
  //       </div>
  //     ) : (
  //       <div>
  //         {/* The navbar will show these links before you log in */}
  //         <Link to="/login">Login</Link>
  //         <Link to="/signup">Sign Up</Link>
  //       </div>
  //     )}
  //   </nav>
  //   <hr />
  // </div>
  // )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
