import { AssessEventDto } from "../dto/event.dto";
import { SuitabilityEngine } from "../engine/suitability.engine";
import { EventClassifierService } from "./event-classifier.service";
import { LocationService } from "./location.service";
import { WeatherService } from "./weather.service";

export class EventService {
  private readonly locationService = new LocationService();
  private readonly weatherService = new WeatherService();
  private readonly classifier = new EventClassifierService();
  private readonly engine = new SuitabilityEngine();

  async assess(dto: AssessEventDto) {
    const location = await this.locationService.resolve(dto.location);

    const weather = await this.weatherService.getWeather(
      location,
      dto.eventDate
    );

    const profile = this.classifier.classify(dto.eventName);

    const assessment = this.engine.evaluate(profile, weather);

    return {
      event: {
        name: dto.eventName,
        profile,
        date: dto.eventDate,
      },

      location: {
        city: location.city,
        country: location.country,
      },

      weather,

      assessment,
    };
  }
}