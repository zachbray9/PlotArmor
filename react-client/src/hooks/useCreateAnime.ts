import { useState } from "react"
import { myApiAgent } from "../api/myApiAgent"
import { CreateAnimeFormFields } from "../schemas/createAnimeSchema"
import CreateAnimeRequest from "../models/requests/createAnimeRequest"
import { toaster } from "../components/ui/toaster"

export default function useCreateAnime() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const uploadImage = async (file: File, title: string, type: "poster" | "banner") => {
        //upload images and return s3 keys
        const posterFormData = new FormData()

        const posterArrayBuffer = await file.arrayBuffer()
        const freshPosterFile = new File([posterArrayBuffer], file.name, {
            type: file.type
        })

        posterFormData.append("title", title)
        posterFormData.append("type", type)
        posterFormData.append("image", freshPosterFile)
        const response = await myApiAgent.Images.upload(posterFormData)

        if (!response.success || !response.data) {
            throw new Error("Failed to upload poster")
        }

        return response.data
    }

    const createAnime = async (data: CreateAnimeFormFields) => {
        setIsSubmitting(true)

        try {
            const posterS3Key = await uploadImage(data.poster, data.englishTitle, "poster")
            const bannerS3Key = await uploadImage(data.banner, data.englishTitle, "banner")

            //send create anime request using form data and s3 image keys
            const createAnimeRequest: CreateAnimeRequest = {
                englishTitle: data.englishTitle,
                romajiTitle: data.romajiTitle,
                synopsis: data.synopsis,
                ageRating: data.ageRating,
                season: data.season,
                seasonYear: data.seasonYear,
                format: data.format,
                genres: data.genres.map((id) => Number(id)),
                studios: data.studios.map((id) => Number(id)),
                episodes: data.episodes,
                duration: data.duration,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                trailerUrl: data.trailerUrl ?? "",
                isAdult: data.isAdult,
                poster: posterS3Key ?? "",
                banner: bannerS3Key ?? ""
            }
            console.log("creating anime...")
            const animeRes = await myApiAgent.Animes.create(createAnimeRequest)
            console.log("finished creating anime!")

            if (!animeRes.success) {
                throw new Error("Failed to create anime")
            }

            toaster.create({
                title: "Success!",
                description: "Successfully added new anime to the database.",
                type: "success",
                closable: true,
                duration: 7000,
            })

            return true
        } catch(error) {
            toaster.create({
                title: "Failed to create anime",
                description: "There was a problem adding the anime to our database.",
                type: "error",
                closable: true,
                duration: 7000,
            })

            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return { createAnime, isSubmitting }
}