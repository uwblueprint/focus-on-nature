import { Text, VStack } from "@chakra-ui/react";
import { Select, GroupBase, MultiValue } from "chakra-react-select";
import React from "react";
import { UserResponse } from "../../../types/UserTypes";

// In menu, show user's name and email
// In control, show user's name only
const formatOptionLabel = (user: UserResponse, { context }: any) => {
  if (context === "menu") {
    return (
      <>
        <VStack alignItems="left" width="100%">
          <Text textStyle="bodyRegular">
            {user.firstName} {user.lastName}
          </Text>
          <Text textStyle="xSmallRegular">{user.email}</Text>
        </VStack>
      </>
    );
  }
  return `${user.firstName} ${user.lastName}`;
};

const UserSelect = ({
  placeholderText,
  users,
  onChange,
}: {
  placeholderText?: string;
  users: UserResponse[];
  onChange: (newVal: MultiValue<UserResponse>) => void;
}): JSX.Element => {
  return (
    <>
      <Select<UserResponse, true, GroupBase<UserResponse>>
        components={{
          DropdownIndicator: () => null,
        }}
        useBasicStyles
        isMulti
        isClearable={false}
        name="selectComponent"
        options={users}
        placeholder={placeholderText}
        closeMenuOnSelect={false}
        size="md"
        onChange={onChange}
        formatOptionLabel={formatOptionLabel}
      />
    </>
  );
};

export default UserSelect;
