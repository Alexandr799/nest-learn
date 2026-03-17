import { ConfigService } from "@nestjs/config";

export default (config: ConfigService) => {
    const token = config.get('TELEGRAM_TOKEN')
    if (!token) {
        throw new Error('Токен телеграма не задан')
    }
    return {
        token,
        chatId: config.get('TELEGRAM_CHAT_ID') ?? '',
    }
}