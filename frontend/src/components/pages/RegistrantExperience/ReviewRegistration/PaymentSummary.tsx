import {
  Box,
  Divider,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { CartItem } from "../../../../types/RegistrationTypes";

const tableHeadingTextStyles = {
  base: "xSmallBold",
  lg: "displaySmallSemiBold",
};

const tableRowTextStyles = {
  base: "xSmallMedium",
  lg: "displaySmallRegular",
};

const totalRowTextStyles = {
  sm: "xSmallBold",
  md: "captionSemiBold",
  lg: "displayMediumBold",
};

type PaymentSummaryProps = {
  campName: string;
  items: CartItem[];
};

const PaymentSummary = ({
  campName,
  items,
}: PaymentSummaryProps): React.ReactElement => {
  const calculateTotalPrice = (cartItems: CartItem[]): number =>
    cartItems.reduce((prevTotal, curItem) => prevTotal + curItem.totalPrice, 0);

  return (
    <Box>
      <Text
        textStyle={{
          sm: "xSmallBold",
          md: "bodyBold",
          lg: "displayXLarge",
        }}
        mb={3}
      >
        {campName} Registration
      </Text>
      <Text
        textStyle={{ sm: "xSmallBold", md: "xSmallBold", lg: "displayLarge" }}
        color="primary.green.100"
      >
        Your Cart
      </Text>

      <TableContainer
        mb={5}
        mt={8}
        maxW={{ base: "100%", lg: "50%" }}
        h={{ lg: "35vh" }}
        overflowY={{ base: "visible", lg: "auto" }}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textTransform="none" color="text.default.100" pl={0}>
                <Text textStyle={tableHeadingTextStyles}>Item</Text>
              </Th>
              <Th textTransform="none" color="text.default.100" isNumeric>
                <Text textStyle={tableHeadingTextStyles}>Campers</Text>
              </Th>
              <Th
                textTransform="none"
                color="text.default.100"
                pr={0}
                isNumeric
              >
                <Text
                  textStyle={tableHeadingTextStyles}
                  wordBreak="break-word"
                  whiteSpace="normal"
                >
                  Total Price (CAD)
                </Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr
                key={item.name}
                borderBottom={index + 1 === items.length ? "0px" : "1px"}
                borderColor="border.secondary.100"
              >
                <Td pl={0}>
                  <Text
                    textStyle={tableRowTextStyles}
                    wordBreak="break-word"
                    whiteSpace="normal"
                  >
                    {item.name}
                  </Text>
                  <Text
                    textStyle={{ base: "xSmallRegular", lg: "xSmallMedium" }}
                    wordBreak="break-word"
                    whiteSpace="normal"
                  >
                    {item.details}
                  </Text>
                </Td>
                <Td isNumeric>
                  <Text textStyle={tableRowTextStyles}>{item.campers}</Text>
                </Td>
                <Td pr={0} isNumeric>
                  <Text textStyle={tableRowTextStyles}>
                    {item.totalPrice.toFixed(2)}
                  </Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Divider
        borderBottom="2px"
        borderColor="border.secondary.100"
        w={{ base: "100%", lg: "50%" }}
      />

      <Flex
        direction="row"
        justify="space-between"
        my={4}
        w={{ base: "100%", lg: "30%" }}
      >
        <Text textStyle={totalRowTextStyles}>Total</Text>
        <Text textStyle={totalRowTextStyles}>
          ${calculateTotalPrice(items).toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
};

export default PaymentSummary;
