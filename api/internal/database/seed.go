package database

import (
	"log"
	"myanimevault/internal/models/entities"

	"gorm.io/gorm"
)

func SeedInitialData(db *gorm.DB) error {
	// Seed genres first
	if err := seedGenres(db); err != nil {
		return err
	}

	// Seed studios
	_, err := seedStudios(db)
	if err != nil {
		return err
	}

	log.Println("✅ Database seeded successfully with sample data!")
	log.Println("💡 This sample data will be updated as users contribute real anime information")
	return nil
}

func seedGenres(db *gorm.DB) error {
	genres := []entities.Genre{
		{Name: "Action", Description: "High-energy sequences with combat, chases, and adventure"},
		{Name: "Adventure", Description: "Journey-focused stories with exploration and discovery"},
		{Name: "Comedy", Description: "Humorous content designed to entertain and amuse"},
		{Name: "Drama", Description: "Character-driven stories with emotional depth"},
		{Name: "Ecchi", Description: "Playful fanservice with teasing, awkward encounters, and risqué comedy"},
		{Name: "Fantasy", Description: "Stories with magical, supernatural, or otherworldly elements"},
		{Name: "Horror", Description: "Dark and unsettling stories with fear, suspense, and supernatural or psychological terror"},
		{Name: "Mahou shoujo", Description: "Whimsical adventures of young heroines who use magical powers to protect the world and discover themselves"},
		{Name: "Mecha", Description: "Futuristic battles and drama featuring giant robots and their pilots"},
		{Name: "Music", Description: "Stories centered on bands, idols, and the power of performance and song"},
		{Name: "Mystery", Description: "Intriguing plots with secrets, clues, and suspenseful investigations"},
		{Name: "Psychological", Description: "Mind-bending stories that explore human emotions, manipulation, and the darker sides of the psyche"},
		{Name: "Romance", Description: "Stories focused on romantic relationships and love"},
		{Name: "Sci-Fi", Description: "Science fiction with futuristic or technological themes"},
		{Name: "Slice of Life", Description: "Realistic portrayals of everyday life and activities"},
		{Name: "Sports", Description: "Competitive stories of athletes chasing victory, teamwork, and personal growth through their game"},
		{Name: "Supernatural", Description: "Stories featuring otherworldly powers, spirits, and phenomena beyond the natural world"},
		{Name: "Thriller", Description: "Tense and suspenseful stories full of danger, twists, and high-stakes situations"},
	}

	for _, genre := range genres {
		if err := db.FirstOrCreate(&genre, entities.Genre{Name: genre.Name}).Error; err != nil {
			return err
		}
	}

	log.Printf("✅ Seeded %d genres\n", len(genres))
	return nil
}

func seedStudios(db *gorm.DB) ([]entities.Studio, error) {
	studios := []entities.Studio{
		{
			Name:    "Toei Animation",
			Website: "https://www.toei-animation-usa.com/",
		},
		{
			Name:    "Studio Pierrot",
			Website: "https://www.pierrot.co.jp/",
		},
		{
			Name:    "Madhouse",
			Website: "https://www.madhouse.co.jp/",
		},
		{
			Name:    "Studio Bones",
			Website: "https://www.bones.co.jp/",
		},
		{
			Name:    "Kyoto Animation",
			Website: "https://www.kyotoanimation.co.jp/en/",
		},
		{
			Name:    "Wit Studio",
			Website: "https://www.witstudio.co.jp/",
		},
		{
			Name:    "MAPPA",
			Website: "https://www.mappa.co.jp/",
		},
		{
			Name:    "Ufotable",
			Website: "https://www.ufotable.com/",
		},
		{
			Name:    "Studio Ghibli",
			Website: "https://www.ghibli.jp/",
		},
		{
			Name:    "Sunrise",
			Website: "https://www.sunrise-inc.co.jp/international/",
		},
		{
			Name:    "A-1 Pictures",
			Website: "https://a1p.jp/",
		},
		{
			Name:    "Studio Trigger",
			Website: "https://www.st-trigger.co.jp/",
		},
		{
			Name:    "8-bit",
			Website: "https://8bit-studio.co.jp/",
		},
		{
			Name:    "CoMix Wave Films",
			Website: "https://www.cwfilms.jp/",
		},
		{
			Name:    "Arvo Animation",
			Website: "https://arvo-animation.co.jp/",
		},
		{
			Name:    "Production I.G",
			Website: "https://www.production-ig.co.jp/",
		},
		{
			Name:    "Asahi Production",
			Website: "https://asahi-pro.co.jp/",
		},
	}

	var createdStudios []entities.Studio
	for _, studio := range studios {
		if err := db.FirstOrCreate(&studio, entities.Studio{Name: studio.Name}).Error; err != nil {
			return nil, err
		}
		createdStudios = append(createdStudios, studio)
	}

	log.Printf("✅ Seeded %d studios\n", len(studios))
	return createdStudios, nil
}
