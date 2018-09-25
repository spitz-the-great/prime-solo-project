import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header.js';
import axios from 'axios';

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

        const response = window.confirm(`This will delete your user name, password, your friends. 
        It's game over, man. Ya done. Finito. 
        Do you want to delete all the things?`); if(response == true){

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
    }} // end deleteUser

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

        if (this.props.user.userName && this.props.profile[0] ) {
            content = (
                <div>
                    <p>Manage Profile</p>
                    <div>{this.props.profile[0].privacy_setting &&
                        <p>Current privacy setting: {this.props.profile[0].privacy_setting}</p>
                    }</div>
                    <br />

                    <br />
                    <form onSubmit={this.searchUsers}>
                        <input
                            onChange={this.handleChange}
                            value={this.state.searchName}
                            type="text" name="searchName">
                        </input>
                        <button type="submit" >Search Users</button>
                        <br />
                        <div>{this.state.foundUserName &&
                            <p>Your search found a match! Username: {this.state.foundUserName}</p>
                        }</div>
                    </form>
                    <br />

                    <button onClick={this.setPrivate}>Set To Private</button>
                    <button onClick={this.setPublic}>Set To Public</button>
                    <br /><br />

                    {/* <div className='delete-button' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(item) } } /> */}

                    <button onClick={this.deleteUser}>Delete Account</button>

                </div>
            );
        }

        return (
            <div>
                <Header className="Header" title="Multiplayer Chat App" />
                <Nav />
                {content}
            </div>
        );
    } // end render()

}

export default connect(mapStateToProps)(ProfilePage);