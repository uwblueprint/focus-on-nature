import { Select, OptionBase, GroupBase } from "chakra-react-select";
import React from "react";
import { User } from "../../../types/CampsTypes";

interface CampCoordinatorOption extends OptionBase {
  value: string;
  label: string;
}

const SelectComponent = ({
  placeholderText,
  users,
  onChange,
}: {
  placeholderText?: string;
  users?: User[];
  onChange?: any;
}): JSX.Element => {
  return (
    <>
      <Select<CampCoordinatorOption, true, GroupBase<CampCoordinatorOption>>
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
      />
    </>
  );
};

export default SelectComponent;
