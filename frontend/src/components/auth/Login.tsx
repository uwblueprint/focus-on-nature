import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";

import { Center, Image, Text, VStack } from "@chakra-ui/react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { CAMPS_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

import fonLogo from "../../assets/fon_logo.svg";

const DEFAULT_LOGIN_MESSAGE =
  "If you do not have a Focus on Nature email, please contact a Focus on Nature admin first.";

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
  const response = res as AuthenticatedUser;
  return response !== null && response.id !== undefined;
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
    console.log(res);
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
          <VStack spacing={5} w="300px">
            <GoogleLogin
              onSuccess={(response: CredentialResponse): void => {
                if (response.credential) {
                  onGoogleLoginSuccess(response.credential);
                } else {
                  setLoginStatus("fail");
                  setLoginErrorMessage(LoginErrorMessages.Error);
                  // eslint-disable-next-line no-alert
                  window.alert(response);
                }
              }}
              onError={(): void => {
                setLoginStatus("fail");
                setLoginErrorMessage(LoginErrorMessages.Error);
                // eslint-disable-next-line no-alert
                window.alert("Google login failed. Please try again.");
              }}
            />
            <Text
              mt="20px"
              textStyle="xSmallRegular"
              textAlign="center"
              color={
                loginStatus === "fail"
                  ? "text.critical.100"
                  : "text.default.100"
              }
            >
              {loginStatus === "fail"
                ? loginErrorMessage
                : DEFAULT_LOGIN_MESSAGE}
            </Text>
            )
          </VStack>
        </VStack>
      </Center>
    </Center>
  );
};

export default Login;
