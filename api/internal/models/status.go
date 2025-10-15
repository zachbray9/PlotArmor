package models

type Status string

const (
	StatusCurrentlyAiring Status = "CURRENTLY_AIRING"
	StatusFinished Status = "FINISHED"
	StatusNotYetReleased = "NOT_YET_RELEASED"
)