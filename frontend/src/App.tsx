import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./components/pages/NotFound";
import * as Routes from "./constants/Routes";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import customTheme from "./theme/index";
import HooksDemo from "./components/pages/HooksDemo";

import { AuthenticatedUser } from "./types/AuthTypes";
import CampOverviewPage from "./components/pages/CampOverview";
import AccessControlPage from "./components/pages/AccessControl";
import NavBar from "./components/common/NavBar";
import GlobalFormsPage from "./components/pages/GlobalForms";
import CampCreationPage from "./components/pages/CampCreation";
import CampsList from "./components/pages/CampsList/index";
import RegistrantExperiencePage from "./components/pages/RegistrantExperience";
import CamperRefundCancellation from "./components/pages/CamperRefundCancellation";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  return (
    <ChakraProvider theme={customTheme}>
      <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}
        >
          <Router>
            <NavBar />
            <Switch>
              <Route exact path={Routes.LOGIN_PAGE} component={Login} />
              <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
              <PrivateRoute
                exact
                path={Routes.HOME_PAGE}
                component={CampsList}
              />
              <PrivateRoute
                exact
                path={Routes.CAMPS_PAGE}
                component={CampsList}
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
              <PrivateRoute
                exact
                path={Routes.CAMP_EDIT_PAGE}
                component={CampCreationPage}
              />
              <Route
                exact
                path={Routes.CAMP_REGISTER_PAGE}
                component={RegistrantExperiencePage}
              />
              <Route
                exact
                path={Routes.CAMP_WAITLIST_PAGE}
                component={RegistrantExperiencePage}
              />
              <Route
                exact
                path={Routes.CAMPER_REFUND_CANCELLATION}
                component={CamperRefundCancellation}
              />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        </GoogleOAuthProvider>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;
