import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: 150,
        height: 150,
    },
};

class ChatAvatars extends React.Component {
    constructor(props){
        super(props)

        
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.row}>

                <Avatar 
                    src={this.props.path}
                    className={classNames(classes.avatar, classes.bigAvatar)}>
                    {/* <p>{this.props.username}</p> */}
                    </Avatar>
            </div>
        );
    }
}

ChatAvatars.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatAvatars);