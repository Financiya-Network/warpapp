import {
  parseQueryString,
  withLimitParam,
  withDirectionParam,
  Direction,
} from "@apps-shared/api/utils";
import { QueryParamConfigMap, StringParam, withDefault } from "serialize-query-params";
import { ParsedQs } from "qs";

interface QueryStringParameters {
  direction: Direction;
  limit: number;
  chain: string;
}

export const parseQueryParameters = (
  query: ParsedQs
): QueryStringParameters => {
  const definition: QueryParamConfigMap = {
    direction: withDirectionParam(),
    limit: withLimitParam(),
    chain: withDefault(StringParam, 'terra'),
  };

  return parseQueryString<QueryStringParameters>(query, definition);
};
