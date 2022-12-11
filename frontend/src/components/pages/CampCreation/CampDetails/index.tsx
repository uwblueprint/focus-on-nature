import React, { useState, useRef } from "react";
import {
  Text,
  Textarea,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Select,
  HStack,
  Checkbox,
  Button,
  Image,
} from "@chakra-ui/react";
import IconImage from "../../../../assets/icon_image.svg";
import { MAX_CAMP_DESC_LENGTH } from "../../../../constants/CampManagementConstants";

type CampCreationDetailsProps = {
  campName: string;
  campDescription: string;
  dailyCampFee: number;
  startTime: string;
  endTime: string;
  ageLower: number;
  ageUpper: number;
  campCapacity: number;
  offersEDLP: boolean;
  earliestDropOffTime: string;
  latestPickUpTime: string;
  priceEDLP: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  campImageURL: string;
  handleCampName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCampDescription: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleDailyCampFee: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeLower: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgeUpper: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCampCapacity: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleEDLP: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEarliestDropOffTime: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleLatestPickUpTime: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceEDLP: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressLine1: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressLine2: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCity: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleProvince: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePostalCode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setCampImageURL: React.Dispatch<React.SetStateAction<string>>;
};

const CampCreationDetails = ({
  campName,
  campDescription,
  dailyCampFee,
  startTime,
  endTime,
  ageLower,
  ageUpper,
  campCapacity,
  offersEDLP,
  earliestDropOffTime,
  latestPickUpTime,
  priceEDLP,
  addressLine1,
  addressLine2,
  city,
  province,
  postalCode,
  campImageURL,
  handleCampName,
  handleCampDescription,
  handleDailyCampFee,
  handleStartTime,
  handleEndTime,
  handleAgeLower,
  handleAgeUpper,
  handleCampCapacity,
  toggleEDLP,
  handleEarliestDropOffTime,
  handleLatestPickUpTime,
  handlePriceEDLP,
  handleAddressLine1,
  handleAddressLine2,
  handleCity,
  handleProvince,
  handlePostalCode,
  setCampImageURL,
}: CampCreationDetailsProps): React.ReactElement => {
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showImageError, setShowImageError] = useState<boolean>(false);

  const errorText = (input: boolean | string | number, message: string) => {
    return (
      <Text
        textStyle="caption"
        color="red"
        marginTop="8px"
        display={!input && showErrors ? "" : "none"}
      >
        {message}
      </Text>
    );
  };

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleCampImageClick = () => {
    if (imageInputRef && imageInputRef.current) imageInputRef.current.click();
  };

  const handleFile = (file: File) => {
    if (file) {
      const fileType = file.type.split("/")[0];
      const fileSize = Math.round(file.size / 1024);

      if (fileType === "image" && fileSize <= 5 * 1024) {
        const url = URL.createObjectURL(file);
        setCampImageURL(url);
        setShowImageError(false);
      } else setShowImageError(true);
    }
  };

  const handleCampImageURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      handleFile(event.target.files[0]);
    }
  };

  const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };

  return (
    <Box paddingLeft="200px">
      <Text textStyle="displayXLarge" marginTop="56px">
        Camp Details
      </Text>
      <Text textStyle="displayLarge" marginTop="32px">
        Overview
      </Text>

      <Text textStyle="buttonSemiBold" marginTop="32px">
        Camp Name{" "}
        <Text as="span" textStyle="buttonSemiBold" color="red">
          *
        </Text>
      </Text>
      <Input
        width="575px"
        height="51px"
        marginTop="8px"
        defaultValue={campName}
        borderColor={!campName && showErrors ? "red" : "gray.200"}
        borderWidth={!campName && showErrors ? "2px" : "1px"}
        onChange={handleCampName}
      />
      {errorText(campName, "You must add a name.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Short Description (max ${MAX_CAMP_DESC_LENGTH.toString()} characters){" "}
        <Text as="span" textStyle="buttonSemiBold" color="red">
          *
        </Text>
      </Text>
      <Textarea
        width="575px"
        marginTop="8px"
        maxLength={MAX_CAMP_DESC_LENGTH}
        defaultValue={campDescription}
        borderColor={!campDescription && showErrors ? "red" : "gray.200"}
        borderWidth={!campDescription && showErrors ? "2px" : "1px"}
        onChange={handleCampDescription}
      />
      {errorText(campDescription, "You must add a description.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Daily Camp Fee{" "}
        <Text as="span" textStyle="buttonSemiBold" color="red">
          *
        </Text>
      </Text>
      <InputGroup width="275px" marginTop="8px">
        <InputLeftElement pointerEvents="none" color="black" fontSize="1.2em">
          $
        </InputLeftElement>
        <Input
          type="number"
          placeholder="0.00"
          defaultValue={dailyCampFee}
          borderColor={!dailyCampFee && showErrors ? "red" : "gray.200"}
          borderWidth={!dailyCampFee && showErrors ? "2px" : "1px"}
          onChange={handleDailyCampFee}
        />
      </InputGroup>
      {errorText(dailyCampFee, "You must add a fee.")}

      <HStack alignItems="start" spacing={4} marginTop="24px">
        <Box width="160px">
          <Text textStyle="buttonSemiBold">
            Start Time{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>

          <Input
            type="time"
            placeholder="XX:XX"
            width="160px"
            height="52px"
            marginTop="8px"
            defaultValue={startTime}
            borderColor={!startTime && showErrors ? "red" : "gray.200"}
            borderWidth={!startTime && showErrors ? "2px" : "1px"}
            onChange={handleStartTime}
          />
          {errorText(startTime, "You must specify a time.")}
        </Box>

        <Text paddingTop="45px"> to </Text>

        <Box width="160px">
          <Text textStyle="buttonSemiBold">
            End Time{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>
          <Input
            type="time"
            placeholder="XX:XX"
            width="160px"
            height="52px"
            marginTop="8px"
            defaultValue={endTime}
            borderColor={!endTime && showErrors ? "red" : "gray.200"}
            borderWidth={!endTime && showErrors ? "2px" : "1px"}
            onChange={handleEndTime}
          />
          {errorText(endTime, "You must specify a time.")}
        </Box>
      </HStack>

      <HStack
        alignItems="start"
        spacing={8}
        marginTop="24px"
        marginBottom="24px"
      >
        <Box>
          <Text textStyle="buttonSemiBold">
            Age Range{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>

          <HStack alignItems="start" spacing={4} marginTop="8px">
            <Box width="100px">
              <Input
                type="number"
                width="100px"
                height="52px"
                maxLength={2}
                defaultValue={ageLower}
                borderColor={!ageLower && showErrors ? "red" : "gray.200"}
                borderWidth={!ageLower && showErrors ? "2px" : "1px"}
                onChange={handleAgeLower}
              />
              {errorText(ageLower, "You must enter an age.")}
            </Box>
            <Text paddingTop="14px"> to </Text>
            <Box width="100px">
              <Input
                type="number"
                width="100px"
                height="52px"
                maxLength={2}
                defaultValue={ageUpper}
                borderColor={!ageUpper && showErrors ? "red" : "gray.200"}
                borderWidth={!ageUpper && showErrors ? "2px" : "1px"}
                onChange={handleAgeUpper}
              />
              {errorText(ageUpper, "You must enter an age.")}
            </Box>
          </HStack>
        </Box>

        <Box>
          <Text textStyle="buttonSemiBold">
            Camp Capacity{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>
          <Box width="200px">
            <Input
              type="number"
              width="200px"
              height="52px"
              marginTop="8px"
              defaultValue={campCapacity}
              borderColor={!campCapacity && showErrors ? "red" : "gray.200"}
              borderWidth={!campCapacity && showErrors ? "2px" : "1px"}
              onChange={handleCampCapacity}
            />
            {errorText(campCapacity, "You must enter a number.")}
          </Box>
        </Box>
      </HStack>

      <Checkbox marginTop="8px" onChange={toggleEDLP} isChecked={offersEDLP}>
        <Text textStyle="buttonSemiBold">
          Camp offers early drop-off and late pick-up
        </Text>
      </Checkbox>

      {offersEDLP && (
        <Box>
          <HStack alignItems="start" spacing={4} marginTop="24px">
            <Box width="160px">
              <Text textStyle="buttonSemiBold">
                Earliest Drop-off{" "}
                <Text as="span" textStyle="buttonSemiBold" color="red">
                  *
                </Text>
              </Text>

              <Input
                type="time"
                placeholder="XX:XX"
                width="160px"
                height="52px"
                marginTop="8px"
                defaultValue={earliestDropOffTime}
                borderColor={
                  !earliestDropOffTime && showErrors ? "red" : "gray.200"
                }
                borderWidth={!earliestDropOffTime && showErrors ? "2px" : "1px"}
                onChange={handleEarliestDropOffTime}
              />
              {errorText(earliestDropOffTime, "You must specify a time.")}
            </Box>

            <Text paddingTop="45px"> to </Text>

            <Box width="160px">
              <Text textStyle="buttonSemiBold">
                Latest Pick-up{" "}
                <Text as="span" textStyle="buttonSemiBold" color="red">
                  *
                </Text>
              </Text>

              <Input
                type="time"
                placeholder="XX:XX"
                width="160px"
                height="52px"
                marginTop="8px"
                defaultValue={latestPickUpTime}
                borderColor={
                  !latestPickUpTime && showErrors ? "red" : "gray.200"
                }
                borderWidth={!latestPickUpTime && showErrors ? "2px" : "1px"}
                onChange={handleLatestPickUpTime}
              />
              {errorText(latestPickUpTime, "You must specify a time.")}
            </Box>
          </HStack>

          <Text textStyle="buttonSemiBold" marginTop="24px">
            EDLP Price Per 30 Minutes{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>

          <InputGroup width="275px" marginTop="8px">
            <InputLeftElement
              pointerEvents="none"
              color="black"
              fontSize="1.2em"
            >
              $
            </InputLeftElement>
            <Input
              type="number"
              placeholder="0.00"
              defaultValue={priceEDLP}
              borderColor={!priceEDLP && showErrors ? "red" : "gray.200"}
              borderWidth={!priceEDLP && showErrors ? "2px" : "1px"}
              onChange={handlePriceEDLP}
            />
          </InputGroup>
          {errorText(priceEDLP, "You must add a fee.")}
        </Box>
      )}
      <Box
        width="50%"
        maxWidth="870px"
        bg="#8C9196"
        height="2px"
        margin="40px 0"
      />

      <Text textStyle="displayLarge">Camp Location</Text>

      <Text textStyle="buttonSemiBold" marginTop="32px">
        Address Line 1{" "}
        <Text as="span" textStyle="buttonSemiBold" color="red">
          *
        </Text>
      </Text>
      <Input
        width="575px"
        height="52px"
        marginTop="8px"
        defaultValue={addressLine1}
        borderColor={!addressLine1 && showErrors ? "red" : "gray.200"}
        borderWidth={!addressLine1 && showErrors ? "2px" : "1px"}
        onChange={handleAddressLine1}
      />
      {errorText(addressLine1, "You must enter an address.")}

      <Text textStyle="buttonSemiBold" marginTop="24px">
        Address Line 2{" "}
      </Text>
      <Input
        width="575px"
        height="52px"
        marginTop="8px"
        defaultValue={addressLine2}
        onChange={handleAddressLine2}
      />

      <HStack alignItems="start" marginTop="24px" spacing="20px">
        <Box width="250px">
          <Text textStyle="buttonSemiBold">
            City{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>
          <Input
            height="52px"
            marginTop="8px"
            defaultValue={city}
            borderColor={!city && showErrors ? "red" : "gray.200"}
            borderWidth={!city && showErrors ? "2px" : "1px"}
            onChange={handleCity}
          />
          {errorText(city, "You must enter a city name.")}
        </Box>
        <Box width="250px">
          <Text textStyle="buttonSemiBold">
            Province{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>
          <Select
            height="52px"
            marginTop="8px"
            defaultValue={province}
            borderColor={
              (!province || province === "-") && showErrors ? "red" : "gray.200"
            }
            borderWidth={
              (!province || province === "-") && showErrors ? "2px" : "1px"
            }
            onChange={handleProvince}
          >
            <option value="-">-</option>
            <option value="Alberta">Alberta</option>
            <option value="British Columbia">British Columbia</option>
            <option value="Manitoba">Manitoba</option>
            <option value="New Brunswick">New Brunswick</option>
            <option value="Newfoundland and Labrador">
              Newfoundland and Labrador
            </option>
            <option value="Northwest Territories">Northwest Territories</option>
            <option value="Nova Scotia">Nova Scotia</option>
            <option value="Nunavut">Nunavut</option>
            <option value="Ontario">Ontario</option>
            <option value="Prince Edward Island">Prince Edward Island</option>
            <option value="Quebec">Quebec</option>
            <option value="Saskatchewan">Saskatchewan</option>
            <option value="Yukon">Yukon</option>
          </Select>
          {errorText(
            !(!province || province === "-"),
            "You must select a province.",
          )}
        </Box>
        <Box width="250px">
          <Text textStyle="buttonSemiBold">
            Postal Code{" "}
            <Text as="span" textStyle="buttonSemiBold" color="red">
              *
            </Text>
          </Text>
          <Input
            height="52px"
            marginTop="8px"
            maxLength={7}
            defaultValue={postalCode}
            borderColor={!postalCode && showErrors ? "red" : "gray.200"}
            borderWidth={!postalCode && showErrors ? "2px" : "1px"}
            onChange={handlePostalCode}
          />
          {errorText(postalCode, "You must enter a postal code.")}
        </Box>
      </HStack>

      <Box
        width="50%"
        maxWidth="870px"
        bg="#8C9196"
        height="2px"
        margin="40px 0"
      />

      <Text textStyle="displayLarge">Camp Image</Text>

      <input
        type="file"
        onChange={handleCampImageURL}
        ref={imageInputRef}
        style={{ display: "none" }}
        accept="image/*"
      />
      <Box
        marginTop="32px"
        bg="background.grey.200"
        width="528px"
        height="325px"
        border="3px"
        borderStyle="dashed"
        borderColor="gray.200"
        onDragOver={handleOnDragOver}
        onDrop={handleOnDrop}
        _hover={{
          borderColor: "gray.400",
        }}
        onClick={handleCampImageClick}
        cursor="pointer"
      >
        {!campImageURL ? (
          <>
            <Image
              margin="35px auto 0 auto"
              src={IconImage}
              alt="File upload icon"
              width="190px"
            />
            <Text
              textStyle="buttonSemiBold"
              textAlign="center"
              marginTop="30px"
            >
              Click or drag and drop to add an image
              <br />
              Max File Size: 5 MB{" "}
            </Text>
          </>
        ) : (
          <Image width="528px" height="319px" src={campImageURL} alt="camp" />
        )}
      </Box>
      <Text
        textStyle="caption"
        color="red"
        marginTop="8px"
        display={showImageError ? "" : "none"}
      >
        Please upload images less than 5 MB.
      </Text>

      <Button
        marginTop="8px"
        marginRight="20px"
        aria-label="Replace Image"
        border="1px"
        borderRadius="5px"
        color="primary.green.100"
        bg="white"
        borderColor="primary.green.100"
        minWidth="-webkit-fit-content"
        display={!campImageURL ? "none" : ""}
        cursor="pointer"
        onClick={handleCampImageClick}
      >
        Replace Image
      </Button>

      <Box marginTop="20px">
        <Button onClick={() => setShowErrors(true)}>Dummy Submit</Button>
      </Box>
    </Box>
  );
};

export default CampCreationDetails;
