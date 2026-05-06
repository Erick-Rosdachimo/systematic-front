import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Icon, Text, Avatar, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function IncludedResearchers({researchers, setResearchers}:any) {
  // Backend
  function filterSearch(search: string){
    return function (researcher:any){
      const fullResearcherReference = `${researcher.name} - ${researcher.email}`;
      return (fullResearcherReference.toLowerCase().includes(search.toLowerCase()));
    }
  }

  function filterStatus(status: string){
    return function (researcher:any){
      return (researcher.status === status);
    }
  }

  function filterSearchAndStatus({ search, status }: { search?: string; status?: string }) {
    let result = researchers;
  
    if (status) {
      result = result.filter(filterStatus(status));
    }
  
    if (search) {
      result = result.filter(filterSearch(search));
    }
  
    return result;
  }

  function excludeResearcher(id: string){
    setResearchers(researchers.map((researcher:any) => {
      if(researcher.id == id){
        return { ...researcher, status: "none" };
      }
      else{
        return researcher;
      }
    }))
  }

  const [listedResearchers, setListedResearchers] = useState(() => [
    ...filterSearchAndStatus({ status: "pending" }),
    ...filterSearchAndStatus({ status: "expired" }),
    ...filterSearchAndStatus({ status: "included" }),
  ]);

  const handleDelete = (id: string, name: string, email: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name} (${email})?`,
    );
    if (!confirmed) return;

    excludeResearcher(id);
  };

  useEffect(() => {
    setListedResearchers([
      ...filterSearchAndStatus({ status: "pending" }),
      ...filterSearchAndStatus({ status: "expired" }),
      ...filterSearchAndStatus({ status: "included" }),
    ]);
  }, [researchers]);

  return (
    <>
    {listedResearchers.map((researcher:any) => (
      <Flex align="center" gap={5} px ={4} py={2} borderWidth="1px" borderColor="gray.200" borderRadius="md">
        <Avatar size="sm" name={researcher.name} />
        <Flex align="center" justify="space-between" flex="1">
          <Text>{researcher.name} - {researcher.email}</Text>
          <Flex align="center" gap={5}>
            {(researcher.status === "pending" || researcher.status === "expired" || researcher.status === "excluding") && (
              <Text color="gray.500">
                {researcher.status.charAt(0).toUpperCase() + researcher.status.slice(1)}
              </Text>
            )}
            {researcher.status == "included" && (<Text>Role: {researcher.role}</Text>)}
            <Button
              variant="ghost"
              onClick={() =>
                handleDelete(researcher.id, researcher.name, researcher.email)
              }
            >
              <Icon as={DeleteIcon} w={"15px"} h={"15px"} />
            </Button>
          </Flex> 
        </Flex>
      </Flex>
    ))}
    </>
  );
}
