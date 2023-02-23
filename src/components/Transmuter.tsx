import {
  Button,
  Card,
  CardHeader,
  Divider,
  Flex,
  Select,
  Skeleton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import { translate } from "../transumter/translate";

import {
  availableLanguges,
  initialText,
  OUTPUT_MAX_LEN,
} from "../var/constants";

export const Transmuter = () => {
  const [value, setValue] = React.useState<string>(initialText);
  const [result, setResult] = React.useState<string>("");
  const [from, setFrom] = React.useState<string>("English");
  const [to, setTo] = React.useState<string>("German");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val: string = _.get(e, "target.value", "");
    if (_.size(val) > OUTPUT_MAX_LEN) {
      return;
    }
    setValue(val);
  };

  const handleTranslate = async () => {
    setLoading(true);
    const prompt = `Translate ${from} to ${to}: ${value}`;
    const result = await translate(prompt);
    setResult(result);
    setLoading(false);
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Card p={3} minW={400} maxW={400}>
        <Select
          mt={2}
          value={from}
          placeholder="Translate from"
          onChange={(e) => {
            const val = _.get(e, "target.value", "");
            setFrom(val);
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
            const val = _.get(e, "target.value", "");
            setTo(val);
          }}
        >
          {_.filter(availableLanguges, (lang) => lang !== from).map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
        <Textarea onChange={handleChange} mt={2} value={value} rows={5} />
        <Text as="small">
          {value.length} / {OUTPUT_MAX_LEN}
        </Text>
        <Button mt={2} onClick={handleTranslate}>
          Translate
        </Button>
        {loading ? (
          <Skeleton mt={2} height="40px" />
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
