import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf'
import type { ITelegramOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.conts';


@Injectable()
export class TelegramService {
    bot: Telegraf
    options: ITelegramOptions

    constructor(
        @Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions
    ) {
        this.options = options
        this.bot = new Telegraf(options.token)
    }

    async sendMessage(message: string = '', chatId:string = this.options.chatId) {
        return await this.bot.telegram.sendMessage(chatId, message)
    }
}
