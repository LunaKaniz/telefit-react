import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./layout";
import Index from "./pages";
import Bmi from "./pages/Bmi";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CompleteRegistration from "./components/CompleteRegistration";

export default function App() {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Index />
            </Route>

            <Route exact path="/bmi">
              <Bmi />
            </Route>

            <Route
              path="/complete-registration"
              component={CompleteRegistration}
            />

            <Route exact path="/signup">
              <Signup />
            </Route>

            <Route exact path="/login">
              <Login />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </>
  );
}
