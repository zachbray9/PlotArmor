package dtos

type StudioDto struct {
	Id   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"not null;unique"`
}
