package utils

import (
	"encoding/json"

	"github.com/invopop/jsonschema"
)

func GenerateSchema[T any]() map[string]interface{} {
	// Structured Outputs uses a subset of JSON schema
	// These flags are necessary to comply with the subset
	reflector := jsonschema.Reflector{
		AllowAdditionalProperties: false,
		DoNotReference:            true,
	}
	var v T
	schema := reflector.Reflect(v)
	schemaJson, err := schema.MarshalJSON()
	if err != nil {
		panic(err)
	}

	var schemaObj map[string]interface{}
	err = json.Unmarshal(schemaJson, &schemaObj)
	if err != nil {
		panic(err)
	}

	return schemaObj
}
