"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_1 = __importDefault(require("../format"));
/**
 * indirect refs dereference
 * in case some workers are not compatible with indirect refs
 * @param JSONSchema JSON Schema
 * @returns JSON Schema with indirect refs derefered
 */
const derefer = async (JSONSchema) => {
    let jsonStr = await (0, format_1.default)(JSON.stringify(JSONSchema));
    // get all references
    let refs = references(jsonStr);
    let indirectRefs;
    // get indirect reference
    while ((indirectRefs = refs.map(ref => indirectReferences(JSONSchema, ref)).filter(Boolean)).length > 0) {
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
const references = (jsonStr) => {
    const regex = /"\$ref": "(.*)"/gm;
    const matches = jsonStr.matchAll(regex);
    const references = Array.from(matches, match => match[1]);
    return [...new Set(references)];
};
// get indirect reference
const indirectReferences = (jsonObject, ref) => {
    const nodes = ref?.replace("#/", "")?.split("/");
    let path = "#";
    let current = jsonObject;
    let next;
    if (nodes.length > 0) {
        for (let node of nodes) {
            if (!(next = current[node]))
                break;
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
exports.default = derefer;
