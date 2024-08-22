import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./layout";
import Index from "./pages";
import Bmi from "./pages/Bmi";

export default function App() {
  return (
    <>
    <Router>
      <Layout>
          <Switch>

            <Route exact path="/">
              <Index/>
            </Route>

            <Route exact path="/bmi">
              <Bmi/>
            </Route>

          </Switch>
      </Layout>
    </Router>
    </>
  )
}
