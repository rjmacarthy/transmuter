import {
  Button,
  Card,
  Flex,
  Skeleton,
  Text,
  Textarea,
} from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import { translate } from "../transumter/translate";

import {
  initialText,
  OUTPUT_MAX_LEN,
} from "../var/constants";

export const Transmuter = () => {
  const [value, setValue] = React.useState<string>(initialText);
  const [result, setResult] = React.useState<string>("");
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
    const result = await translate(value);
    setResult(result);
    setLoading(false);
  };

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Card p={3} minW={400} maxW={400}>
        <Textarea onChange={handleChange} mt={2} value={value} rows={5} />
        <Text as="small">
          {value.length} / {OUTPUT_MAX_LEN}
        </Text>
        <Button mt={2} onClick={handleTranslate}  colorScheme='blue'>
          Go
        </Button>
        {loading ? (
          <Skeleton mt={3} height="40px" />
        ) : (
          <Text
            sx={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
            mt={3}
          >
            {result}
          </Text>
        )}
      </Card>
    </Flex>
  );
};
