import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";

import { Button, Center, Image, Text, VStack } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import authAPIClient from "../../APIClients/AuthAPIClient";
import { CAMPS_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

import fonLogo from "../../assets/fon_logo.svg";

type GoogleResponse = GoogleLoginResponse | GoogleLoginResponseOffline;

type GoogleErrorResponse = {
  error: string;
  details: string;
};

enum ResponseError {
  Invalid = `Invalid Google domain for the account.`,
  Inactive = `User is inactive.`,
}

enum LoginErrorMessages {
  Error = `There was an error logging in with Google SSO, please try again.`,
  Invalid = `Invalid email entered. Please contact a Focus on Nature admin to gain access to the Camp Management Tool.`,
  Inactive = `The account associated with this email is currently inactive. Please contact a Focus on Nature admin to gain access to the Camp Management Tool.`,
}

function isAuthenticatedUserType(
  res: AuthenticatedUser | string,
): res is AuthenticatedUser {
  return (res as AuthenticatedUser)!.id !== undefined;
}

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [loginStatus, setLoginStatus] = useState<"" | "success" | "fail">("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>(
    LoginErrorMessages.Invalid,
  );

  const onGoogleLoginSuccess = async (tokenId: string) => {
    const res: AuthenticatedUser | string = await authAPIClient.loginWithGoogle(
      tokenId,
    );

    if (isAuthenticatedUserType(res)) {
      setLoginStatus("success");
      setAuthenticatedUser(res);
    } else {
      setLoginStatus("fail");
      if (res === ResponseError.Inactive)
        setLoginErrorMessage(LoginErrorMessages.Inactive);
      else setLoginErrorMessage(LoginErrorMessages.Invalid);
    }
  };

  if (authenticatedUser) {
    return <Redirect to={CAMPS_PAGE} />;
  }

  return (
    <Center bg="background.grey.100" maxWidth="100vw" height="100vh">
      <Center
        width="50%"
        height="80%"
        bg="background.white.100"
        p="50px"
        border="2px solid"
        borderColor="border.secondary.100"
        borderRadius="50px"
      >
        <VStack spacing="48px">
          <Image src={fonLogo} alt="Focus on Nature logo" width="200px" />
          <Text
            textStyle="displayXLarge"
            color="text.default.100"
            textAlign="center"
          >
            Camp Management Tool Login
          </Text>
          <div style={{ textAlign: "center" }}>
            <GoogleLogin
              clientId={process.env.REACT_APP_OAUTH_CLIENT_ID || ""}
              render={(renderProps) => (
                <Button
                  leftIcon={<FcGoogle />}
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  textStyle="buttonSemiBold"
                  variant={
                    loginStatus !== "fail" ? "googleLogin" : "googleLoginError"
                  }
                >
                  Log in with Google SSO
                </Button>
              )}
              onSuccess={(response: GoogleResponse): void => {
                if ("tokenId" in response) {
                  onGoogleLoginSuccess(response.tokenId);
                } else {
                  setLoginStatus("fail");
                  setLoginErrorMessage(LoginErrorMessages.Error);
                  // eslint-disable-next-line no-alert
                  window.alert(response);
                }
              }}
              onFailure={(error: GoogleErrorResponse) => {
                setLoginStatus("fail");
                setLoginErrorMessage(LoginErrorMessages.Error);
                // eslint-disable-next-line no-alert
                window.alert(JSON.stringify(error));
              }}
            />
            {loginStatus === "fail" && (
              <Text
                mt="20px"
                textStyle="xSmallRegular"
                color="text.critical.100"
              >
                {loginErrorMessage}
              </Text>
            )}
          </div>
        </VStack>
      </Center>
    </Center>
  );
};

export default Login;
