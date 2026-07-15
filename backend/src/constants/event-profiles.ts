// Can be replaced later with an AI model that can classify the event based on the event name
export enum EventProfile {
    FORMAL = "formal",
    CASUAL = "casual",
    SPORTS = "sports",
    ADVENTURE = "adventure",
    ENTERTAINMENT = "entertainment",
    GENERAL = "general",
  }
  
  export const EVENT_PROFILES: Record<EventProfile, string[]> = {
    [EventProfile.FORMAL]: [
      "wedding",
      "marriage",
      "church",
      "conference",
      "graduation",
    ],
  
    [EventProfile.CASUAL]: [
      "birthday",
      "picnic",
      "party",
      "bbq",
    ],
  
    [EventProfile.SPORTS]: [
      "football",
      "basketball",
      "volleyball",
      "marathon",
    ],
  
    [EventProfile.ADVENTURE]: [
      "camping",
      "hiking",
      "trek",
    ],
  
    [EventProfile.ENTERTAINMENT]: [
      "concert",
      "festival",
      "show",
    ],
  
    [EventProfile.GENERAL]: [],
  };