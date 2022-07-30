import { Text, VStack } from "@chakra-ui/react";
import { Select, OptionBase, GroupBase } from "chakra-react-select";
import React from "react";
import { UserOption } from "../../../types/CampsTypes";

interface CampCoordinatorOption extends OptionBase {
  value: string;
  label: string;
}

const formatOptionLabel = (user: UserOption, { context }: any) => {
  if (context === "menu") {
    return (
      <>
        <VStack alignItems="left">
          <Text textStyle="bodyRegular">{user.name}</Text>
          <Text textStyle="xSmallRegular">{user.email}</Text>
        </VStack>
      </>
    );
  }
  return user.name;
};

const SelectComponent = ({
  placeholderText,
  users,
  onChange,
}: {
  placeholderText?: string;
  users?: UserOption[];
  onChange?: any;
}): JSX.Element => {
  return (
    <>
      <Select<UserOption, true, GroupBase<UserOption>>
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        useBasicStyles
        isMulti
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

export default SelectComponent;
