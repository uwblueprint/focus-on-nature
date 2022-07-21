import { Select, OptionBase, GroupBase } from "chakra-react-select";

import React, { useEffect, useState } from "react";

interface CampCoordinatorOption extends OptionBase {
  value: string;
  label: string;
}

const options = [
  { value: "id1", label: "Michael Scott" },
  { value: "id2", label: "Dwight Shrute" },
];

const SelectComponent = (): JSX.Element => {
  return (
    <>
      <Select<CampCoordinatorOption, false, GroupBase<CampCoordinatorOption>>
        useBasicStyles
        name="campcoordinators"
        options={options}
        placeholder="Select a camp coordinator..."
        closeMenuOnSelect={false}
        size="md"
      />
    </>
  );
};

export default SelectComponent;
