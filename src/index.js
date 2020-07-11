import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Profile from './components/Profile/Profile';
import Header from './components/Header/Header';
import Lessons from './components/Lessons/Lessons';
import Courses from './components/Courses/Courses';
import StudentSchedule from './components/Schedule/StudentSchedule';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Header />
            <Router>
                <Route exact path="/" component={App} />
                <Route exact path="/profile/:username" component={Profile} />
                <Route exact path="/profile/:username/lessons" component={Lessons} />
                <Route exact path="/profile/:username/courses" component={Courses} />
                <Route exact path="/profile/:username/student-schedule" component={StudentSchedule} />
            </Router>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
