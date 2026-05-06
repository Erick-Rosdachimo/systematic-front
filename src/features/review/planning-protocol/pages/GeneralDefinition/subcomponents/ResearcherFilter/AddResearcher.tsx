import { Flex, Input, Box, Avatar, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import EventButton from "@components/common/buttons/EventButton";

export default function AddResearcher({researchers, setResearchers}:any) {
  // Backend
  function filterSearch(search: string){
    return function (researcher:any){
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(search.toLowerCase()));
    }
  }

  function filterStatus(research:any){
    return (research.status == "none")
  }

  function filterSearchAndStatus({ search, status }: { search?: string; status?: string }) {
    let result = researchers;
  
    if (status) {
      result = result.filter(filterStatus);
    }
  
    if (search) {
      result = result.filter(filterSearch(search));
    }
  
    return result;
  }

  function inviteResearcher(id: string){
    setResearchers(researchers.map((researcher:any) => {
      if(researcher.id == id){
        return { ...researcher, status: "pending" };
      }
      else{
        return researcher;
      }
    }))
  }

  const [search, setSearch] = useState("");
  const [potentialResearchers, setPotentialResearchers] = useState(() => filterSearchAndStatus({ status: "none" }));
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [chosenResearcherId, setChosenResearcherId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddResearcher = () => {
    inviteResearcher(chosenResearcherId);

    // Reset all states
    setPotentialResearchers(filterSearchAndStatus({ status: "none" }));
    setChosenResearcherId("");
    setSearch("");
    setSuggestionsOpen(false);
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setSearch(e.target.value);
    setChosenResearcherId("");
    setPotentialResearchers(filterSearchAndStatus({ search: e.target.value, status: "none" }));
  }

  return (
    <Flex justify="center" py={2}>
      <Flex gap={2} align="center" width="28rem" position="relative">

        <Input
          ref={inputRef}
          style = {{ backgroundColor: chosenResearcherId !== "" ? "#C9D9E5" : "#ffffffff" }} flex="1" minW={0} size="md"  
          value={search} 
          placeholder="Add a researcher" 
          onChange = {handleInputChange} 
          onFocus={() => setSuggestionsOpen(true)}
          onBlur={() => setSuggestionsOpen(false)}
        />
        
        {suggestionsOpen && (
            <Box position="absolute" width="25rem" top="100%" mt={1} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
              {potentialResearchers.length > 0 ? (
                potentialResearchers.slice(0, 3).map((researcher:any) => (
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
                        setChosenResearcherId(researcher.id);
                        inputRef.current?.blur();
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
          style={{opacity: chosenResearcherId !== "" ? 1 : 0.30}}
          w="40px"
          flexShrink={0}
          onClick={chosenResearcherId !== "" ? handleAddResearcher : undefined}
          disabled={chosenResearcherId === ""}
        />
      </Flex>
    </Flex>
  )
}
