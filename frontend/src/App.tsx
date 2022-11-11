import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./components/pages/NotFound";
import CampsPage from "./components/pages/CampsPage";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import customTheme from "./theme/index";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import HooksDemo from "./components/pages/HooksDemo";

import { AuthenticatedUser } from "./types/AuthTypes";
import CampOverviewPage from "./components/pages/CampOverview";
import AccessControlPage from "./components/pages/AccessControl";
import NavBar from "./components/common/NavBar";
import GlobalFormsPage from "./components/pages/GlobalForms";
import CampCreationPage from "./components/pages/CampCreation";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <SampleContext.Provider value={sampleContext}>
        <SampleContextDispatcherContext.Provider
          value={dispatchSampleContextUpdate}
        >
          <AuthContext.Provider
            value={{ authenticatedUser, setAuthenticatedUser }}
          >
            <Router>
              <NavBar />
              <Switch>
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <PrivateRoute
                  exact
                  path={Routes.HOME_PAGE}
                  component={CampsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.CAMPS_PAGE}
                  component={CampsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.GLOBAL_FORMS_PAGE}
                  component={GlobalFormsPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.HOOKS_PAGE}
                  component={HooksDemo}
                />
                <PrivateRoute
                  exact
                  path={Routes.CAMP_OVERVIEW_PAGE}
                  component={CampOverviewPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.ACCESS_CONTROL_PAGE}
                  component={AccessControlPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.CAMP_CREATION_PAGE}
                  component={CampCreationPage}
                />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </AuthContext.Provider>
        </SampleContextDispatcherContext.Provider>
      </SampleContext.Provider>
    </ChakraProvider>
  );
};

export default App;
