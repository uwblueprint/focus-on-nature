import { Text, VStack } from "@chakra-ui/react";
import { Select, GroupBase, MultiValue } from "chakra-react-select";
import React from "react";
import { UserResponse, UserSelectOption } from "../../../types/UserTypes";

// In menu, show user's name and email
// In control, show user's name only
const formatOptionLabel = (user: UserSelectOption, { context }: any) => {
  if (context === "menu") {
    return (
      <>
        <VStack alignItems="left" width="100%">
          <Text textStyle="bodyRegular">{user.label}</Text>
          <Text textStyle="xSmallRegular">{user.email}</Text>
        </VStack>
      </>
    );
  }
  return user.label;
};

const UserSelect = ({
  onChange,
  placeholderText,
  options,
  value,
}: {
  placeholderText: string;
  onChange: (newVal: MultiValue<UserSelectOption>) => void;
  options: UserSelectOption[];
  value: UserSelectOption[];
}): JSX.Element => {
  return (
    <>
      <Select<UserSelectOption, true, GroupBase<UserSelectOption>>
        components={{
          DropdownIndicator: () => null,
        }}
        value={value}
        useBasicStyles
        isMulti
        isClearable={false}
        name="selectComponent"
        options={options}
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
