import React, { Component } from 'react';
import { Link, Route, Switch ,IndexRoute , Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../assets/css/base.less';
import '../assets/css/font.less';
import '../assets/css/common.less';
import Login from './Login';
import Register from './Register';
import Password from './Password';
import Index from './index';
import TopListPage from './TopListPage';
import AddIssue from './AddIssue';
import Meeting from './meeting';
import Order from '../components/me/order';
import Note from '../components/me/note';
import Issue from '../components/me/issue';
import Interaction from '../components/room/interaction';
import Judge from '../components/me/judge';
import ErrorGather from '../components/me/errorGather';
// import '../assets/js/global';
import '../assets/js/gaodun_callback';
import ErrorModal from "../components/me/errorGather/exercise";

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return (
            <div>
                <Route render={(params) => {
                    let { location } = params;
                    return (
                            <Switch key={location.pathname} location={location}>
                                <Route exact path="/" component={Login} />
                                <Route exact path="/login" component={Login} />
								<Route  path="/register" component={Register} />
								<Route  path="/password" component={Password} />
                                <Route path="/index" component={Index} />
                                {/*<Route path="/room" component={Room} />*/}
                                <Route path="/room/addIssue" component={AddIssue} />
								<Route path="/room/topListPage" component={TopListPage} />
								<Route path="/room/interaction" component={Interaction} />
                                <Route path="/course/meeting" component={Meeting} />
                                <Route path="/me/order" component={Order} />
                                <Route path="/me/note" component={Note} />
                                <Route path="/me/issue" component={Issue} />
                                <Route path="/me/judge" component={Judge} />
                                <Route path="/me/errorGather" component={ErrorGather} />
                                <Route path="/me/errorModal" component={ErrorModal} />
                            </Switch>
                    )
                }}>
                </Route>
            </div>
        )
    }
}