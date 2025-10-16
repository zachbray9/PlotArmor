import { VoiceActor } from "./voiceActor"

export default interface Character {
    id: number
    name: string
    role: string
    imageUrl: string
    voiceActors: VoiceActor[]
}