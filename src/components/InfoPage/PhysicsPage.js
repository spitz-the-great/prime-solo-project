import React, { Component } from 'react';
import { connect } from 'react-redux';
import Matter from "matter-js";

import { USER_ACTIONS } from '../../redux/actions/userActions';

const mapStateToProps = state => ({
    user: state.user,
});

// >>>>>>>>>>>> matter.js start
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        // width: 1000,
        // height: 1000,

    }
}); // end renderer

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

// run the engine
Engine.run(engine);

// // run the renderer
// Render.run(render);


class PhysicsPage extends Component {

    constructor() {
        super()

    }

    componentDidMount() {
        this.props.dispatch({ type: USER_ACTIONS.FETCH_USER });
        // // run the renderer
        Render.run(render);
    }
    render() {
        return(
        <div></div>)

    }


}

export default connect(mapStateToProps)(PhysicsPage);