import format from "../format";

import $RefParser = require("@apidevtools/json-schema-ref-parser");

/**
 * indirect refs dereference
 * in case some workers are not compatible with indirect refs
 * @param JSONSchema JSON Schema
 * @returns JSON Schema with indirect refs derefered
 */
const derefer = async (JSONSchema: $RefParser.JSONSchema) => {
  let jsonStr = await format(JSON.stringify(JSONSchema));

  // get all references
  let refs = references(jsonStr);

  let indirectRefs: { path: string; target: any }[];
  // get indirect reference
  while (
    (indirectRefs = refs.map(ref => indirectReferences(JSONSchema, ref)).filter(Boolean)).length > 0
  ) {
    indirectRefs.forEach(reference => {
      // replace indirect reference with it's actual target
      jsonStr = jsonStr.replaceAll(reference.path, reference.target);

      // update JSONSchema
      JSONSchema = JSON.parse(jsonStr);
      refs = references(jsonStr);
    });
  }
  return JSONSchema;
};

// get all references
const references = (jsonStr: string): string[] => {
  const regex = /"\$ref": "(.*)"/gm;
  const matches = jsonStr.matchAll(regex);
  const references = Array.from(matches, match => match[1]);
  return [...new Set(references)];
};

// get indirect reference
const indirectReferences = (jsonObject: any, ref: string): { path: string; target: string } => {
  const nodes = ref?.replace("#/", "")?.split("/");
  let path = "#";
  let current = jsonObject;
  let next: any;
  if (nodes.length > 0) {
    for (let node of nodes) {
      if (!(next = current[node])) break;
      path = `${path}/${node}`;
      current = next;
      if (typeof next === "object" && next["$ref"] && Object.keys(next).length === 1) {
        return {
          path: path,
          target: next["$ref"]
        };
      }
    }
  }
};

export default derefer;
