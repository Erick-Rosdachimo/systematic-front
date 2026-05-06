import { Text, VStack } from "@chakra-ui/react";
import AddResearcher from "./AddResearcher";
import IncludedResearchers from "./IncludedResearchers";
import {useState} from 'react';
import { researchersMock } from "../../../../../../../mocks/researchers";

export default function ResearcherFilter() {
  const [researchers, setResearchers] = useState(researchersMock)

  return (
    <>
      <Text mt={"30px"} fontWeight={500} fontSize={"large"}>Researchers</Text>

      <VStack spacing={0} align="stretch" border="2px solid" borderColor="gray.300" borderRadius="md" bgColor="#ffffffff" px={2} py={2}>
        <AddResearcher researchers={researchers} setResearchers={setResearchers}/>
        <IncludedResearchers researchers={researchers} setResearchers={setResearchers}/>
      </VStack>
    </>
  );
}
