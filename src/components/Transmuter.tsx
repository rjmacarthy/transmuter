import {
  Button,
  Card,
  Flex,
  Select,
  Skeleton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import { translate } from "../transumter/translate";

import { availableLanguges, OUTPUT_MAX_LEN } from "../var/constants";

export const Transmuter = () => {
  const [value, setValue] = React.useState<string>("");
  const [result, setResult] = React.useState<string>("");
  const [from, setFrom] = React.useState<string>("English");
  const [to, setTo] = React.useState<string>("German");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > OUTPUT_MAX_LEN) {
      return;
    }
    setValue(e.target.value);
  };

  const handleTranslate = async () => {
    setLoading(true);
    const prompt = `Translate ${from} to ${to}: ${value}`;
    console.log(prompt);
    const result = await translate(prompt);
    setResult(result);
    setLoading(false);
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Card p={3} minW={400} maxW={400}>
        <Select
          value={from}
          placeholder="Translate from"
          onChange={(e) => {
            setFrom(e.target.value);
          }}
        >
          {availableLanguges.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
        <Select
          value={to}
          mt={2}
          placeholder="Translate to"
          onChange={(e) => {
            setTo(e.target.value);
          }}
        >
          {_.filter(availableLanguges, (lang) => lang !== from).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
        <Textarea onChange={handleChange} mt={2} />
        <Text as="small">
          {value.length} / {OUTPUT_MAX_LEN}
        </Text>
        <Button mt={2} onClick={handleTranslate}>
          Translate
        </Button>
        {loading ? (
          <Skeleton height="20px" mt={2} />
        ) : (
          <Text
            as="pre"
            sx={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            mt={2}
          >
            {result}
          </Text>
        )}
      </Card>
    </Flex>
  );
};
