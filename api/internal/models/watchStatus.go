package models

type WatchStatus string

const (
	WatchStatusWatching    WatchStatus = "WATCHING"
	WatchStatusCompleted   WatchStatus = "COMPLETED"
	WatchStatusOnHold      WatchStatus = "ON_HOLD"
	WatchStatusDropped     WatchStatus = "DROPPED"
	WatchStatusPlanToWatch WatchStatus = "PLAN_TO_WATCH"
)
