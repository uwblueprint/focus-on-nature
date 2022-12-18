import React from "react";
import { Checkbox } from "@chakra-ui/react";

type WaitlistPersonalInfoPageProps = {
  isChecked: boolean;
  toggleChecked: () => void;
};

const WaitlistPersonalInfoPage = ({
  isChecked,
  toggleChecked,
}: WaitlistPersonalInfoPageProps): React.ReactElement => {
  return (
    <Checkbox isChecked={isChecked} onChange={toggleChecked}>
      Waitlist confirmation step
    </Checkbox>
  );
};

export default WaitlistPersonalInfoPage;
