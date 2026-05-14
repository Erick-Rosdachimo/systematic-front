// External libraries
import {
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

// Hooks
import useToaster from "@components/feedback/Toaster";

// Types
import type { PageLayout } from "../../../structure/LayoutFactory";
import type {
  OptionProps,
  OptionType,
} from "../../../../services/useFetchAllCriteriasByArticle";

interface IComboBoxProps {
  text: string;
  options: OptionProps[];
  isDisabled: boolean;
  onOptionchange?: (option: string, isChecked: boolean) => void;
  status: {
    selectionStatus: string;
    extractionStatus: string;
  };
  page: PageLayout;
  groupKey: OptionType;
  handlerUpdateCriteriasStructure: (
    key: OptionType,
    optionText: string,
    newValue: boolean,
  ) => void;
  selectedCriteria?: string[];
}

export default function ComboBox({
  text,
  options,
  isDisabled,
  onOptionchange,
  page,
  status,
  groupKey,
  handlerUpdateCriteriasStructure,
  selectedCriteria = [],
}: IComboBoxProps) {
  const toast = useToaster();

  const { selectionStatus, extractionStatus } = status;

  const hasInvalidStatus =
    selectionStatus == "DUPLICATED" || extractionStatus == "DUPLICATED";

  const showDuplicatedWarning = () =>
    toast({
      title: "Ação não permitida",
      description:
        "Você não pode incluir ou excluir critérios de um artigo marcado como duplicado pelo sistema.",
      status: "warning",
    });

  const handleToggle = (option: OptionProps, newValue: boolean) => {
    if (hasInvalidStatus) {
      showDuplicatedWarning();
      return;
    }
    handlerUpdateCriteriasStructure(groupKey, option.text, newValue);
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="white"
        color="black"
        isDisabled={isDisabled}
      >
        {text === "Include" ? (
          <HiOutlineCheckCircle size="1.75rem" />
        ) : (
          <HiOutlineXCircle size="1.75rem" />
        )}
      </MenuButton>

      <MenuList maxH="10rem" overflowY="auto">
        {options.map((option, index) => {
          const isHighlighted =
            page === "Extraction" && selectedCriteria.includes(option.text);

          return (
            <MenuItem key={index} maxW="25rem" overflow="auto">
              {text === "Include" || text === "Exclude" ? (
                <Checkbox
                  isDisabled={isDisabled}
                  isChecked={option.isChecked}
                  onChange={(e) => handleToggle(option, e.target.checked)}
                >
                  <Tooltip
                    label={option.text}
                    aria-label="Full criteria"
                    p="1rem"
                    hasArrow
                  >
                    <Text
                      isTruncated
                      maxW="20rem"
                      fontWeight={isHighlighted ? "bold" : "normal"}
                      color={isHighlighted ? "black" : "inherit"}
                    >
                      {option.text}
                    </Text>
                  </Tooltip>
                </Checkbox>
              ) : text === "filter options" && onOptionchange ? (
                <Checkbox
                  isDisabled={isDisabled}
                  onChange={(e) =>
                    onOptionchange?.(option.text, e.target.checked)
                  }
                >
                  <Text fontWeight={isHighlighted ? "bold" : "normal"}>
                    {option.text}
                  </Text>
                </Checkbox>
              ) : (
                <Checkbox isDisabled={isDisabled}>
                  <Text fontWeight={isHighlighted ? "bold" : "normal"}>
                    {option.text}
                  </Text>
                </Checkbox>
              )}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
