import {
  Container,
  Flex,
  Image,
  Stack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { LockIcon, ChevronDownIcon } from "@chakra-ui/icons";

import React, { useContext, useEffect, useState } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import authAPIClient from "../../APIClients/AuthAPIClient";
import FONIcon from "../../assets/fon_icon.svg";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

import COLOR from "../../theme/colors";

const NavBar = (): JSX.Element => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [hoveredItem, setHoveredItem] = useState("");
  const history = useHistory();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      console.log(success);
      history.push(Routes.LOGIN_PAGE);
      setAuthenticatedUser(null);
    }
  };

  useEffect(() => {
    console.log(hoveredItem);
  });

  return (
    <Container maxWidth="100vw">
      <Flex direction="row" align="center" justify="space-between">
        <Image src={FONIcon} alt="FON icon" display="inline"/>
          {authenticatedUser ? (
            <>
              {authenticatedUser.role === Role.ADMIN ? (
                <Stack direction="row" justify="center">
                  <Button
                    bg="#FFF"
                    _hover={{
                      color: COLOR.primary.green[100],
                    }}
                    _active={{
                      color: COLOR.primary.green[100],
                    }}
                    _focus={{
                      color: COLOR.primary.green[100],
                    }}
                    onClick={() => {
                      setHoveredItem("Camps");
                      history.push(Routes.CAMPS_PAGE);
                    }}
                    leftIcon={<FontAwesomeIcon icon={faCampground} />}
                  >
                    Camps
                  </Button>
                  <Button
                    bg="#FFF"
                    _hover={{
                      color: COLOR.primary.green[100],
                    }}
                    _active={{
                      color: COLOR.primary.green[100],
                    }}
                    _focus={{
                      color: COLOR.primary.green[100],
                    }}
                    onClick={() => {
                      setHoveredItem("Global Forms");
                      history.push(Routes.GLOBAL_FORMS_PAGE);
                    }}
                    leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                  >
                    Global Forms
                  </Button>
                  <Button
                    bg="#FFF"
                    _hover={{
                      color: COLOR.primary.green[100],
                    }}
                    _active={{
                      color: COLOR.primary.green[100],
                    }}
                    _focus={{
                      color: COLOR.primary.green[100],
                    }}
                    onClick={() => {
                      setHoveredItem("Access Control");
                      history.push(Routes.ACCESS_CONTROL_PAGE);
                    }}
                    leftIcon={<LockIcon />}
                  >
                    Access Control
                  </Button>
                </Stack>
              ) : (
                <Button
                  bg="#FFF"
                  _hover={{
                    color: COLOR.primary.green[100],
                  }}
                  _active={{
                    color: COLOR.primary.green[100],
                  }}
                  _focus={{
                    color: COLOR.primary.green[100],
                  }}
                  onClick={() => {
                    setHoveredItem("Camps");
                    history.push(Routes.CAMPS_PAGE);
                  }}
                  leftIcon={<FontAwesomeIcon icon={faCampground} />}
                >
                  Camps
                </Button>
              )}
            </>
          ) : null}
          {authenticatedUser ? (
            <>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="#FFF"
                _hover={{
                  color: 'none',
                }}
                _active={{
                  color: 'none',
                }}
                _focus={{
                  color: 'none',
                }}
                >
                  {authenticatedUser?.firstName} {authenticatedUser?.lastName}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={onLogOutClick}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : null}
      </Flex>
    </Container>
  );
};

export default NavBar;
