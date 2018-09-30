import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

// MATERIAL-UI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';

import './User.css';
// import cat from '../../avatarImages/bullet_cat.jpg';
// import nyan from '../../avatarImages/nyan.png';

const avatarList = [
    { name: 'Hover Cat', imgPath: 'avatars/hover_cat.png' },
    { name: 'Nyan Cat', imgPath: 'avatars/nyan_cat.png' },
    { name: 'Grumpy Cat', imgPath: 'avatars/grumpy_cat.png' },
    { name: 'Heavy Breathing Cat', imgPath: 'avatars/heavy_cat.png' },
    { name: 'Maru Cat', imgPath: 'avatars/maru_cat.png' },
    { name: 'Putin Cat', imgPath: 'avatars/putin_cat.png' },
    { name: 'Snoopy Cat', imgPath: 'avatars/snoopy_cat.png' },
    { name: 'Soon Cat', imgPath: 'avatars/soon_cat.png' }
    
]

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class SimpleDialog extends React.Component {
    constructor(props) {
        super(props)
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);

    };
// may need =value => event => {
    handleListItemClick = value  => {
        this.props.onClose(value);
        
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Select Your Chat Cat!</DialogTitle>
                <div>
                    <List>
                        {avatarList.map((avatar, i) => (
                            <ListItem button onClick={() => this.handleListItemClick(avatar.name)} key={i}>
                                <ListItemAvatar>
                                    <Avatar
                                        className={classNames(classes.avatar, classes.bigAvatar)} src={avatar.imgPath} >
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={avatar.name} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

class SimpleDialogDemo extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            open: false,
            selectedValue: '',
        }; 
    }
    
    enterChatPage = () => {
        console.log('in enterChatPage');
        // this.props.history.push('info');
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    updateAvatar(userId, newAvatar) {
        console.log('in update avatar put', userId, newAvatar);
        axios({
            method: 'PUT',
            url: '/api/person/avatar/' + userId,
            data: { avatar: newAvatar },
            success: function (response) {
                console.log('update avatar response: ', response)
            }
        });
    } 

    handleClose = value => {
        this.setState({ selectedValue: value, open: false });
        console.log('in handleClose');
        this.updateAvatar(this.props.userId, value);
        
        this.props.history.push('info');
        // this.enterChatPage();
    };

    render() {
    
        return (
            <div className="dialogButton" >
                <br />
                <Button 
                id="dialogButton"
                className="dialogButton"
                variant="outlined"
                onClick={this.handleClickOpen}
                
                >Enter Main Chat</Button>
                <SimpleDialogWrapped  className="dialogButton"
                    // push={this.enterChatPage}
                    history={this.props.history}
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={this.handleClose}
                />
            </div>
        );
    }
}

export default SimpleDialogDemo;

// export default connect(mapStateToProps)(SimpleDialogDemo);