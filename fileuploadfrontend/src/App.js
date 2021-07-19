import logo from "./logo.svg";
import "./App.css";
import MyComponent from "./myComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./navBar";
import Gallary from "./gallary";
import { Button } from "react-bootstrap";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* Always use link inside router */}
        <Navbar />

        <Switch>
          <Route exact path="/" component={Gallary} />
          {/* <Route exact path="/uploadImage" component={MyComponent} /> */}

          <Route
            exact
            path="/uploadImage"
            component={() => <MyComponent showh2={true} />}
          />

          {/* <Route path="*" component={ErrorPage} /> */}
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
