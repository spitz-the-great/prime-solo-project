import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header.js';
import axios from 'axios';

// material ui imports
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// css
import './Profile.css';

import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { triggerLogout } from '../../redux/actions/loginActions';


const mapStateToProps = state => ({
    user: state.user,
    profile: state.profileReducer
});

class ProfilePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            privacySetting: '',
            searchName: '',
            foundUserName: '',
        }
    } // end constructor

    //// db calls vvvv
    getProfile = () => {

        this.props.dispatch({ type: 'FETCH_PROFILE' });
        console.log('in get profile - client');


    }

    updatePrivacy(userId, newSetting) {
        console.log('in update privacy put', userId, newSetting);
        axios({
            method: 'PUT',
            url: '/api/person/privacy/' + userId,
            data: { setting: newSetting },
            success: function (response) {
                console.log('update privacy response: ', response)
            }
        });
    } // end updatePrivacy

    searchUsers = (event) => {
        event.preventDefault();

        let userToFind = this.state.searchName;
        console.log('in searchUsers', this.state.searchName, userToFind);
        axios({
            method: 'GET',
            url: '/api/person/search/' + userToFind,
            data: { name: userToFind },
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    foundUserName: response.data[0].username,
                })
                console.log(this.state.foundUserName);
            }).catch(function (error) {
                console.log(error);
            });
    }
    logout = () => {
        this.props.dispatch(triggerLogout());
    }
    // click handler for "delete user" button
    deleteUser = () => {

        const response = window.confirm(`This will delete your user name, password, and your friends. 
        No more cats for you. Colors get set back to white. 
        It's game over, man. Ya done. Finito.
        
        Is this what you truly desire?`); if (response == true) {

            console.log('in delete user, user: ', this.props.user.id);
            let id = this.props.user.id;
            axios({
                method: 'DELETE',
                url: '/api/person/delete/' + id,
                success: function (response) {
                    console.log('deleted user', response);
                }
            });
            this.logout();
        }
    } // end deleteUser

    //// end db calls ^^^

    componentDidMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
        this.getProfile();

    }

    componentDidUpdate() {
        if (!this.props.user.isLoading && this.props.user.userName === null) {
            this.props.history.push('home');
        }
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        })
    }

    // click handler for "set to private" button
    setPrivate = () => {
        console.log('in set private')
        this.updatePrivacy(this.props.user.id, 'private');

        this.getProfile();
    }

    // click handler for "set to public" button
    setPublic = () => {
        console.log('in set public')
        this.updatePrivacy(this.props.user.id, 'public');

        this.getProfile();
    }

    render() {

        let content = null;

        if (this.props.user.userName && this.props.profile[0]) {
            content = (
                <div>
                    <h2 className="h2" >Manage Profile</h2>
                    <h3 id="wisdom">Some cats are private. Some cats are alley.<br></br> Live your life.</h3>
                    <div className="profileContainer">

                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                        <Grid item xs={6}>
                            
                            <br></br>
                            <div id="privacy">{this.props.profile[0].privacy_setting &&
                                <p id="privacy">Current privacy setting: <br></br><div></div> {this.props.profile[0].privacy_setting}</p>
                            }</div>
                            
                            <Button id="profileButtons" className="setButtons"
                                variant="outlined" onClick={this.setPrivate}>Set To Private</Button>

                            <Button id="profileButtons" className="setButtons"
                                variant="outlined" onClick={this.setPublic}>Set To Public</Button>
                            <br /><br />

                            <Button id="profileButtons"
                            className="delete"
                                variant="outlined" onClick={this.deleteUser}>Delete Account</Button>
                            <br />
                        </Grid>

                        <Grid item xs={6}>
                            <form id="searchForm" onSubmit={this.searchUsers}>

                                <TextField
                                    id="chatInput"
                                    className="searchButton"
                                    variant="outlined"
                                    label="Enter a user name"
                                    onChange={this.handleChange}
                                    value={this.state.searchName}
                                    type="text" name="searchName">
                                </TextField>

                                <Button id="profileButtons"
                                className="searchButton"
                                    variant="outlined" type="submit" >Search Users</Button>

                                <br />

                                <div>{this.state.foundUserName &&
                                    <p>Your search found a match! Username: {this.state.foundUserName}</p>
                                }</div>
                            </form>
                            </Grid>
                            <br />

                            {/* <Button id="profileButtons"
                                variant="outlined" onClick={this.setPrivate}>Set To Private</Button>

                            <Button id="profileButtons"
                                variant="outlined" onClick={this.setPublic}>Set To Public</Button>
                            <br /><br />

                            <Button id="profileButtons"
                                variant="outlined" onClick={this.deleteUser}>Delete Account</Button> */}
                         </Grid>
                    </div>
                   
                    </div>
                    );
                }
        
                return (
            <div>
                        <Header className="Header" title="Chat Cats" />
                        <Nav />
                        {content}
                    </div>
                    );
                } // end render()
            
            }
            
export default connect(mapStateToProps)(ProfilePage);