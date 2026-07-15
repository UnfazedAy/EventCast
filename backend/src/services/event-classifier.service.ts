import {
    EventProfile,
    EVENT_PROFILES,
  } from "../constants/event-profiles";
  
  export class EventClassifierService {
    classify(eventName: string): EventProfile {
      const normalized = eventName.toLowerCase();
  
      for (const [profile, keywords] of Object.entries(EVENT_PROFILES)) {
        if (keywords.some((keyword) => normalized.includes(keyword))) {
          return profile as EventProfile;
        }
      }
  
      return EventProfile.GENERAL;
    }
  }