import React from "react";
import { FormLabel, Text } from "@chakra-ui/react";
import RequiredAsterisk from "../../../../../common/RequiredAsterisk";

type EditFormLabelProps = {
  title: string;
  subtitle?: string;
  required?: boolean;
};

const EditFormLabel = ({
  title,
  subtitle = "",
  required = false,
}: EditFormLabelProps): React.ReactElement => {
  return (
    <FormLabel>
      <Text textStyle={{ sm: "xSmallBold", lg: "buttonSemiBold" }}>
        {`${title} `}
        {required && (
          <Text
            as="span"
            color="text.critical.100"
            fontSize="xs"
            verticalAlign="super"
          >
            <RequiredAsterisk />
          </Text>
        )}
      </Text>
      {subtitle && (
        <Text textStyle={{ sm: "xSmallRegular", lg: "buttonRegular" }}>
          {`${subtitle} `}
        </Text>
      )}
    </FormLabel>
  );
};

export default EditFormLabel;
