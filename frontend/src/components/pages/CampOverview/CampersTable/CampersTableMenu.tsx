import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { FaEllipsisV } from "react-icons/fa";

const CampersTableMenu = (): JSX.Element => {
  return (
    <Menu placement="bottom-end">
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="" />
      <MenuList minW={0} width="164px" p={0}>
        <MenuItem height="48px">View details</MenuItem>
        <MenuItem height="48px">Move camper</MenuItem>
        <MenuItem height="48px">Edit</MenuItem>
        <MenuItem
          height="48px"
          textColor="secondary.critical.100"
          onClick={() => console.log("hi")}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CampersTableMenu;
