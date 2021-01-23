import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Home from "./containers/Home/Home";
import Landing from "./containers/Landing/Landing";

function App() {
  return (
    <div className="app">
      <Router>
        <CookiesProvider>
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/">
              <Landing />
            </Route>
            <Route path="*">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </CookiesProvider>
      </Router>
    </div>
  );
}

export default App;
