import { Container, Flex, Image, Stack, Button } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

import React, { useContext, useState } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import authAPIClient from "../../APIClients/AuthAPIClient";
import FONIcon from "../../assets/fon_icon.svg";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

const NavBar = (): JSX.Element => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [hoveredItem, setHoveredItem] = useState("");
  const history = useHistory();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      history.push(Routes.LOGIN_PAGE);
      setAuthenticatedUser(null);
    }
  };

  return (
    <Container variant="headerContainer">
      <Flex>
        <Image src={FONIcon} alt="FON icon" display="inline" />
        <Stack spacing="2rem" direction="row" align="center">
          {authenticatedUser ? (
            <>
              {authenticatedUser.role === Role.ADMIN ? (
                <Stack direction="row">
                  <Button leftIcon={<FontAwesomeIcon icon={faCampground} />}>
                    Camps
                  </Button>
                  <Button leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}>
                    Global Forms
                  </Button>
                  <Button leftIcon={<LockIcon />}>Access Control</Button>
                </Stack>
              ) : (
                <Button leftIcon={<FontAwesomeIcon icon={faCampground} />}>
                  Camps
                </Button>
              )}
            </>
          ) : null}
        </Stack>
      </Flex>
    </Container>
  );
};

export default NavBar;
