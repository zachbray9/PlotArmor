package openai

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

const (
	float = 0.7
	model = openai.ChatModelGPT4o
)

func GenerateResponse(context context.Context, client openai.Client, responseSchema map[string]interface{}, schemaName string, prompt string) (*responses.Response, error) {
	params := responses.ResponseNewParams{
		Model:       model,
		Temperature: openai.Float(float),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String(prompt),
		},
		Text: responses.ResponseTextConfigParam{
			Format: responses.ResponseFormatTextConfigUnionParam{
				OfJSONSchema: &responses.ResponseFormatTextJSONSchemaConfigParam{
					Name:   schemaName,
					Schema: responseSchema,
					Strict: openai.Bool(true),
					Type:   "json_schema",
				},
			},
		},
	}

	res, err := client.Responses.New(context, params)

	if err != nil {
		return nil, fmt.Errorf("failed to generate ai response: %w", err)
	}

	return res, nil
}
