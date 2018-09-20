import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header.js';
import axios from 'axios';

import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';


const mapStateToProps = state => ({
    user: state.user,
    profile: state.profileReducer
});

class ProfilePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            privacySetting: ''
        }
    } // end constructor

    getProfile() {
        this.props.dispatch({ type: 'FETCH_PROFILE' });
    }

    updatePrivacy(userId, newSetting) {
        console.log('in update privacy put', userId, newSetting);
        axios({
            method: 'PUT',
            url: '/person/privacy/' + userId,
            data: { setting: newSetting },
            success: function (response) {
                console.log('update privacy response: ', response)
            }
        });
    } // end updatePrivacy

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


    setPrivate = () =>{
        console.log('in set private')
        this.updatePrivacy(this.props.user.id, 'private');
    }

    setPublic = () =>{
        console.log('in set public')
        this.updatePrivacy(this.props.user.id, 'public');
    }


    render() {
        // let location =  this.props.location;
        // let location = window.location.href;
        // let passUrl = location.substr(24, 7);

        let content = null;


        if (this.props.user.userName) {
            content = (
                <div>
                    <p>Manage Profile</p>
                    <p>{JSON.stringify(this.props.profile)}</p>
                    <br/>
                    <br/>
                    {/* <p>{this.props.profileReducer[0].privacy_setting}</p> */}
                    <br/>
                    <button onClick={this.setPrivate}>Set To Private</button>
                    <button onClick={this.setPublic}>Set To Public</button>

                </div>
            );
        }

        return (
            <div>
                <Header title="Multiplayer Chat App" />
                <Nav />
                {content}
            </div>
        );
    } // end render()

}



export default connect(mapStateToProps)(ProfilePage);