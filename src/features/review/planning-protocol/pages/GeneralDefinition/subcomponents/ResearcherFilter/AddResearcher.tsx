import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import EventButton from "@components/common/buttons/EventButton";
import { researchersMock } from "../../../../../../../mocks/researchers";

export default function AddResearcher({researchers, setResearchers}:any) {
  const [search, setSearch] = useState("");
  const [potentialResearchers, setPotentialResearchers] = useState(researchersMock.filter((researcher) => researcher.status == "none"));
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [researcherChosen, setResearcherChosen] = useState(false);
  const [researcherChosenId, setResearcherChosenId] = useState("");

  useEffect(() => {
    // simulating API call to get potential researchers
    setPotentialResearchers(researchers);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setResearcherChosenId("");
    setResearcherChosen(false);
    setSuggestionsOpen(true);
  };

  const handleAddResearcher = () => {
    // Remove the new pending researcher from the potential researchers list
    setPotentialResearchers(potentialResearchers.filter((researcher) => {
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      if(fullResearcherReference == search){
        console.log(fullResearcherReference + " is equal to " + search);
        return false;
      }
      else{
        console.log(fullResearcherReference + " is different from " + search);
        return true;
      }
    }))

    // Reset all states
    setResearcherChosen(false);
    setSearch("");
    setSuggestionsOpen(false);
  };

  function filterSearch(search: string){
    return function (researcher:any){
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(search.toLowerCase()));
    }
  }

  function filterStatus(research:any){
    return (research.status == "none")
  }

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">

        {/* {researchers
          .filter(filterSearch("a"))
          .map((researcher:any) => {
          return <Text> {researcher.name}</Text>
        })} */}

        <Input 
          style = {{ backgroundColor: researcherChosen ? "#C9D9E5" : "#ffffffff" }} flex="1" minW={0} size="md"  
          value={search} 
          placeholder="Add a researcher" 
          onChange = {handleInputChange} 
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => setSuggestionsOpen(false)}
        />
        
        {suggestionsOpen && (
            <Box position="absolute" width="25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
              {researchers.length > 0 ? (
                researchers
                  .filter(filterStatus)
                  .filter(filterSearch(search))
                  .slice(0,3)
                  .map((researcher:any) => (
                    <Flex
                      key={researcher.id}
                      align="center"
                      gap={3}
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearch(`${researcher.name} - ${researcher.email}`);
                        setResearcherChosen(true);
                        setResearcherChosenId(researcher.id);
                        setSuggestionsOpen(false);
                      }}
                    >
                      <Avatar size="sm" name="Potential Researcher 1" />
                      <Text flex="1" fontSize="sm">{researcher.name} - {researcher.email}</Text>
                    </Flex>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center">No researchers found</Text>
                )
            }
        </Box>
        )}

        <EventButton
          style={{opacity: researcherChosen ? 1 : 0.30}}
          w="40px"
          flexShrink={0}
          onClick={researcherChosen ? handleAddResearcher : undefined}
          disabled={!researcherChosen}
        />
      </Flex>
    </Flex>
  )
}
