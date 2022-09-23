import React from "react";

import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { FaEllipsisV } from "react-icons/fa";

type CampersTableKebabMenuProps = {
  viewDetailsFunc: () => void;
  moveCamperFunc: () => void;
  editCamperFunc: () => void;
  removeCamperFunc: () => void;
};

const CampersTableKebabMenu = ({
  viewDetailsFunc,
  moveCamperFunc,
  editCamperFunc,
  removeCamperFunc,
}: CampersTableKebabMenuProps): JSX.Element => {
  return (
    <Menu placement="bottom-end">
      <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="" />
      <MenuList minW={0} width="164px">
        <MenuItem height="48px" onClick={() => viewDetailsFunc()}>
          View details
        </MenuItem>
        <MenuItem height="48px" onClick={() => moveCamperFunc()}>
          Move camper
        </MenuItem>
        <MenuItem height="48px" onClick={editCamperFunc}>
          Edit
        </MenuItem>
        <MenuItem
          height="48px"
          textColor="secondary.critical.100"
          onClick={() => removeCamperFunc()}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default CampersTableKebabMenu;
