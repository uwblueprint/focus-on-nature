import {
  Container,
  Flex,
  Image,
  Button,
  Tabs,
  Tab,
  TabList,
  PopoverContent,
  PopoverTrigger,
  Popover,
  PopoverBody,
} from "@chakra-ui/react";
import { LockIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import React, { useContext } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import authAPIClient from "../../APIClients/AuthAPIClient";
import FONIcon from "../../assets/fon_icon.svg";
import * as Routes from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { Role } from "../../types/AuthTypes";

import COLOR from "../../theme/colors";
import { FontWeights } from "../../theme/textStyles";

const NavBar = (): JSX.Element => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const history = useHistory();

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(authenticatedUser?.id);
    if (success) {
      console.log(success);
      history.push(Routes.LOGIN_PAGE);
      setAuthenticatedUser(null);
    }
  };

  const navigate = (index: number) => {
    switch (index) {
      case 0:
        history.push(Routes.CAMPS_PAGE);
        break;
      case 1:
        history.push(Routes.GLOBAL_FORMS_PAGE);
        break;
      case 2:
        history.push(Routes.ACCESS_CONTROL_PAGE);
        break;
      default:
        history.push(Routes.CAMPS_PAGE);
        break;
    }
  };

  const getIndex = () => {
    switch (window.location.pathname) {
      case Routes.CAMPS_PAGE:
        return 0;
      case Routes.GLOBAL_FORMS_PAGE:
        return 1;
      case Routes.ACCESS_CONTROL_PAGE:
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Container maxWidth="100vw">
      <Flex
        direction="row"
        justifyContent="space-between"
        marginLeft="80px"
        marginRight="80px"
        marginTop="14px"
        marginBottom="14px"
      >
        <Image
          src={FONIcon}
          alt="FON icon"
          display="inline"
          width="40px"
          height="40px"
        />
        {authenticatedUser ? (
          <>
            <Tabs
              variant="unstyled"
              onChange={navigate}
              defaultIndex={getIndex as any}
              width="750px"
              alignContent="center"
            >
              <TabList justifyContent="space-evenly">
                <Tab
                  id="Camps"
                  _selected={{
                    color: COLOR.primary.green[100],
                    fontWeight: FontWeights.BOLD,
                  }}
                >
                  <FontAwesomeIcon icon={faCampground} />
                  &nbsp; Camps
                </Tab>
                {authenticatedUser.role === Role.ADMIN && (
                  <>
                    <Tab
                      id="Global Forms"
                      _selected={{
                        color: COLOR.primary.green[100],
                        fontWeight: FontWeights.BOLD,
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      &nbsp; Global Forms
                    </Tab>
                    <Tab
                      id="Access Control"
                      _selected={{
                        color: COLOR.primary.green[100],
                        fontWeight: FontWeights.BOLD,
                      }}
                    >
                      <LockIcon />
                      &nbsp; Access Control
                    </Tab>
                  </>
                )}
              </TabList>
            </Tabs>
          </>
        ) : null}
        {authenticatedUser ? (
          <>
            <Popover placement="bottom-start" matchWidth>
              {({ isOpen }) => (
                <>
                  <PopoverTrigger>
                    <Button
                      rightIcon={
                        isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                      }
                      bg="#FFF"
                      _hover={{
                        color: "none",
                      }}
                      _active={{
                        color: "none",
                      }}
                      _focus={{
                        color: "none",
                      }}
                    >
                      {authenticatedUser?.firstName}{" "}
                      {authenticatedUser?.lastName}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent width="inherit">
                    <PopoverBody as={Button} bg="#FFF" onClick={onLogOutClick}>
                      Logout
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </>
        ) : null}
      </Flex>
    </Container>
  );
};

export default NavBar;
