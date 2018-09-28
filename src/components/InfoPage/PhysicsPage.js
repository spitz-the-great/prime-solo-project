import React, { Component } from 'react';
import { connect } from 'react-redux';
import Matter from "matter-js";
import axios from 'axios';

import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
    user: state.user,
});


const avatarList = [
    { name: 'hoverCat', imgPath: 'avatars/bullet_cat.jpg' },
    { name: 'nyanCat', imgPath: 'avatars/nyan.png' },
]

// >>>>>>>>>>>> matter.js start
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
// let phys = document.getElementById('phys');
// create a renderer
var render = Render.create({
    // element: phys,
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        // width: 1000,
        // height: 1000,

    }
}); // end renderer

// create two boxes and a ground
var boxA = Bodies.rectangle(200, 100, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

let avatar = Bodies.circle(400, 300, 46, {
    render: {
        sprite: {
            texture: avatarList[0].imgPath,
            // xScale: 2,
            // yScale: 2
        }
    }
});

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, avatar, ground]);

// // run the engine
// Engine.run(engine);

// // run the renderer
// Render.run(render);

class PhysicsPage extends Component {



    constructor(props) {
        super(props)
        this.state = {
            avatarFromDb: '',
            pathFromDb: '',
        }
        // this.getAvatarPath();
    }

    componentDidMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });

        // // run the renderer
        Render.run(render);
        // run the engine
        Engine.run(engine);

        // this.getAvatarPath(this.props.avatar);
    }

    componentWillUnmount() {

        // Matter.World.clear(this.engine.world);
        // Matter.Engine.clear(this.engine);
        // Matter.Render.stop(render);
        // Matter.Runner.stop;
        // Render.stop(render);
        // render.canvas.remove();
        // render.canvas = null;
        // render.context = null;
        // render.textures = {};
    }


    getAvatar = () => {
        console.log('in get avatar');
        axios({
          method: 'GET',
          url: 'api/person/getAvatar'
        }).then((results) => {
          console.log('avatar results: ', results)
          this.setState({
            avatarFromDb: results.data.avatar,
            pathFromDb: results.data.path
          })
        }).catch((error) => {
          console.log('Error getting count', error);
        })
      } // need to write sql that joins profile and avatar tables and gets both avatar name and path
      //  ON profile avatar WHERE user_profile.avatar = avatar.name
      // WHERE req.user.id matches profile id,
    render(){
        let path = this.state.path;
        return (
            <div id="phys">
                {this.props.avatar}
                {path}
            </div>
        )
    }

}

export default connect(mapStateToProps)(PhysicsPage);