import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import SignIn from './admin/SignIn';


const routes = [
    {
        path: "/",
        exact: true,
        main: () => <Home />
    },
    {
      path: "/admin",
      main: () => <SignIn />
    }
];

class App extends Component {
    render() { 
        return ( 
            <Router>
                <React.Fragment>
                    {
                        routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                component={route.main}
                            />
                        ))
                    }
                </React.Fragment>
            </Router>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
