import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Header from '../Header/Header.js';
import Nav from '../../components/Nav/Nav';
import SimpleDialogDemo from './AvatarDialog.js';

// material ui imports
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// css
import './User.css';


import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';

// import cat from '../../../public/bullet_cat.jpg';

// material ui dialog imports
// import Button from '@material-ui/core/Button';
// import Avatar from '@material-ui/core/Avatar';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemText from '@material-ui/core/ListItemText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Dialog from '@material-ui/core/Dialog';
// import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
// import Typography from '@material-ui/core/Typography';

import '../../styles/main.css';

const mapStateToProps = state => ({
  user: state.user,
});

const avatarList = [
  { name: 'hoverCat', imgPath: '../../../public/bullet_cat.jpg' }
];

class UserPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedAvatar: {
        name: '',
        imgPath: '',
      }
    }

    this.enterChatPage = this.enterChatPage.bind(this);
  }


  componentDidMount() {
    this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
  }

  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('home');
    }
  }

  logout = () => {
    this.props.dispatch(triggerLogout());
  }

  enterChatPage = () => {
    this.props.history.push('info');
  }

  render() {

    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <h2
            id="welcome"
            className="welcomeUsers"
          >
            Sup, {this.props.user.userName}?!
          </h2>
          <h3 className="welcomeUsers">
            See if there are any other cool cats around.</h3>
          <h3 className="welcomeUsers"> Go on and hit that button.</h3>

          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <SimpleDialogDemo id="dialogButton" history={this.props.history}
              userId={this.props.user.id} enterChatPage={this.enterChatPage} />
          </Grid>

          
          {/* <Button
            variant="outlined"
            onClick={this.logout}
          >
            Log Out
          </Button> */}
        </div>
      );
    }

    return (
      <div>
        <Header title="Chat Cats" />
        <Nav history={this.props.history} />
        {content}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);

