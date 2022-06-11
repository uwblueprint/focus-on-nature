import { Container, Flex, Image,} from "@chakra-ui/react";

import React, { useContext, useState } from "react";
import { Link as ReactLink, useHistory } from "react-router-dom";

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
          <Flex
           
          >
            <Image
                src={FONIcon}
                alt="FON icon"
                display="inline"
            />
        </Flex>
   </Container>);
};

export default NavBar;