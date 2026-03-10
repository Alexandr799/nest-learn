import { ConfigService } from "@nestjs/config";

export default (config: ConfigService) => {
    return {
        uri: config.get('MONGO_URI'),
    }
}