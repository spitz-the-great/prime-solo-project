import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header.js';

import Nav from '../../components/Nav/Nav';

import { USER_ACTIONS } from '../../redux/actions/userActions';


const mapStateToProps = state => ({
    user: state.user,
});

class ProfilePage extends Component {



    componentDidMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
    }

    componentDidUpdate() {
        if (!this.props.user.isLoading && this.props.user.userName === null) {
            this.props.history.push('home');
        }
    }

    render() {
        // let location =  this.props.location;
        let location =  window.location.href;
        let passUrl = location.substr(24, 7);

        let content = null;


        if (this.props.user.userName) {
            content = (
                <div>
                    <p>
                        Manage Profile
              </p>
              <p>{passUrl}</p>
              
                </div>
            );
        }

        return (
            <div>
                <Header title="Multiplayer Chat App" />
                <Nav  />
                {content}
            </div>
        );
    }
}    

  

export default connect(mapStateToProps)(ProfilePage);