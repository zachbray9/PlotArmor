package models

type AnimeMetaData struct {
	Themes              []string `json:"themes" jsonschema_description:"List of themes of the anime"`
	Tags                []string `json:"tags" jsonschema_description:"List of tags of the anime"`
	Demographic         string   `json:"demographic" jsonschema_description:"Demographic of the anime. One of: shounen, seinen, shoujo, josei, kodomo, unknown"`
	Tone                string   `json:"tone" jsonschema_description:"Tone of the anime. e.g., dark, comedic, emotional, uplifting, cozy"`
	Pacing              string   `json:"pacing" jsonschema_description:"Pace of the anime. One of: slow, medium, fast"`
	Vibes               []string `json:"vibes" jsonschema_description:"List of 3-8 descriptive vibe words of the anime"`
	RecommendedAudience string   `json:"recommendedAudience" jsonschema_description:"Recommended audience of the anime. e.g., teens+, adults, all-ages"`
}