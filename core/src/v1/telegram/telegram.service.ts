import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telegraf } from 'telegraf';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { User } from '../users/user.entity';
import { Customer } from '../customer/customer.enitity';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf | null = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN') {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN is not defined or is default. Telegram bot will be disabled.',
      );
      return;
    }

    try {
      this.bot = new Telegraf(token);
      this.setupBotCommands();
      this.bot.launch().catch((err) => {
        this.logger.error('Failed to launch Telegram bot: ' + err.message);
      });
      this.logger.log('Telegram Bot initialized and listening for commands.');
    } catch (err: any) {
      this.logger.error('Error creating Telegraf instance: ' + err.message);
    }
  }

  onModuleDestroy() {
    if (this.bot) {
      this.bot.stop('SIGINT');
      this.logger.log('Telegram Bot stopped.');
    }
  }

  private setupBotCommands() {
    if (!this.bot) return;

    // Command: /start
    this.bot.start((ctx) => {
      const greeting =
        `Welcome to the Customer Notification Bot! 🤖\n\n` +
        `To link your customer account and receive alerts, please use the /link command with your registered Telegram username.\n\n` +
        `Example:\n` +
        `/link your_telegram_username\n\n` +
        `Available Commands:\n` +
        `/link <telegram_username> - Link your registered Telegram username\n` +
        `/status - Check your linking status\n` +
        `/unlink - Unlink your account\n` +
        `/help - Show this guide`;
      ctx.reply(greeting);
    });

    // Command: /help
    this.bot.help((ctx) => {
      ctx.reply(
        `Help Guide ℹ️\n\n` +
        `• Link account: /link <telegram_username>\n` +
        `• Check status: /status\n` +
        `• Unlink account: /unlink`,
      );
    });

    // Command: /link <telegram_username>
    this.bot.command('link', async (ctx) => {
      const messageText = ctx.message.text;
      const args = messageText.split(/\s+/).slice(1);

      if (args.length < 1) {
        return ctx.reply(
          '❌ Usage: /link <telegram_username>\nExample: /link john_tg',
        );
      }

      const tele_username = args[0].trim().replace(/^@/, '').toLowerCase();
      const chatId = ctx.chat.id.toString();
      const tgHandle = ctx.from?.username || '';

      try {
        const customer = await this.customerRepository
          .createQueryBuilder('customer')
          .where('LOWER(customer.telegramUsername) = :username', {
            username: tele_username,
          })
          .getOne();

        if (!customer) {
          return ctx.reply(
            `❌ No registered customer found with Telegram username: ${tele_username}`,
          );
        }

        // Link the telegram chat ID
        customer.telegramChatId = chatId;
        customer.telegramLinked = 'true';
        if (tgHandle) {
          customer.telegramUsername = tgHandle;
        }
        await this.customerRepository.save(customer);

        this.logger.log(
          `Telegram account linked successfully: ${customer.customerName} (${customer.telegramUsername}) -> Chat ID: ${chatId}`,
        );
        return ctx.reply(
          `✅ Successfully linked your Telegram account to ${customer.customerName}! You will now receive customer notifications here.`,
        );
      } catch (error: any) {
        this.logger.error(`Error linking customer with Telegram: ${error.message}`);
        return ctx.reply(
          '❌ An error occurred while linking your account. Please try again later.',
        );
      }
    });

    // Command: /unlink
    this.bot.command('unlink', async (ctx) => {
      const chatId = ctx.chat.id.toString();

      try {
        const customer = await this.customerRepository.findOne({
          where: { telegramChatId: chatId },
        });
        if (!customer) {
          return ctx.reply(
            '❌ No customer account is currently linked to this Telegram chat.',
          );
        }

        const name = customer.customerName;
        customer.telegramChatId = undefined;
        customer.telegramLinked = 'false';
        await this.customerRepository.save(customer);

        this.logger.log(`Telegram customer account unlinked: ${name}`);
        return ctx.reply(`✅ Successfully unlinked from account: ${name}.`);
      } catch (error: any) {
        this.logger.error(`Error unlinking customer: ${error.message}`);
        return ctx.reply(
          '❌ An error occurred while unlinking. Please try again.',
        );
      }
    });

    // Command: /status
    this.bot.command('status', async (ctx) => {
      const chatId = ctx.chat.id.toString();
      try {
        const customer = await this.customerRepository.findOne({
          where: { telegramChatId: chatId },
        });
        if (customer) {
          return ctx.reply(
            `ℹ️ Customer Telegram Connection Status:\n` +
            `• Linked Customer: ${customer.customerName}\n` +
            `• Phone: ${customer.phoneNumber || 'N/A'}\n` +
            `• Username: @${customer.telegramUsername || 'N/A'}`,
          );
        } else {
          return ctx.reply(
            'ℹ️ Account Status: Not linked.\nUse `/link <your_telegram_username>` to connect.',
          );
        }
      } catch (error) {
        return ctx.reply('❌ Error fetching connection status.');
      }
    });
  }

  /**
   * Replace placeholders in message template with customer/user properties
   */
  private formatMessage(
    template: string,
    customer: Customer,
  ): string {
    const name = customer.customerName || '';
    const phone = customer.phoneNumber || '';
    const telegramUsername = customer.telegramUsername ? `@${customer.telegramUsername}` : '';
    const citizenId = customer.citizenId || '';
    const email = customer.user?.email || '';
    const role = customer.user?.role || '';

    return template
      .replace(/{name}/g, name)
      .replace(/{phone}/g, phone)
      .replace(/{telegramUsername}/g, telegramUsername)
      .replace(/{citizenId}/g, citizenId)
      .replace(/{email}/g, email)
      .replace(/{role}/g, role)
      .replace(/{date}/g, new Date().toLocaleDateString());
  }

  /**
   * Broadcast a customized message to matching registered customers
   */
  async broadcastNotification(dto: BroadcastNotificationDto) {
    if (!this.bot) {
      throw new BadRequestException(
        'Telegram bot is not initialized. Please verify your TELEGRAM_BOT_TOKEN.',
      );
    }

    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('customer.telegramChatId IS NOT NULL');

    if (dto.userIds && dto.userIds.length > 0) {
      query.andWhere('customer.id IN (:...userIds)', { userIds: dto.userIds });
    }

    if (dto.role) {
      query.andWhere('user.role = :role', { role: dto.role });
    }

    if (dto.position) {
      query.andWhere('user.position = :position', { position: dto.position });
    }

    const customers = await query.getMany();

    if (customers.length === 0) {
      return {
        success: true,
        message:
          'No customers found matching the filter criteria with linked Telegram accounts.',
        sentCount: 0,
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const failures: { userId: string; name: string; error: string }[] = [];

    for (const customer of customers) {
      if (!customer.telegramChatId) continue;
      const customizedMessage = this.formatMessage(dto.message, customer);
      try {
        await this.bot.telegram.sendMessage(
          customer.telegramChatId,
          customizedMessage,
        );
        sentCount++;
      } catch (error: any) {
        this.logger.error(
          `Failed to send telegram message to customer ${customer.id} (${customer.customerName}): ${error.message}`,
        );
        failedCount++;
        failures.push({
          userId: customer.id,
          name: customer.customerName,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      message: `Broadcast completed. Sent: ${sentCount}, Failed: ${failedCount}`,
      sentCount,
      failedCount,
      failures,
    };
  }

  /**
   * Send a customized message to a single registered customer
   */
  async sendNotification(dto: SendNotificationDto) {
    if (!this.bot) {
      throw new BadRequestException(
        'Telegram bot is not initialized. Please verify your TELEGRAM_BOT_TOKEN.',
      );
    }

    const customer = await this.customerRepository.findOne({
      where: { id: dto.userId },
      relations: { user: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${dto.userId} not found.`);
    }

    if (!customer.telegramChatId) {
      throw new BadRequestException(
        `Customer ${customer.customerName} (${customer.phoneNumber || customer.id}) does not have a linked Telegram account.`,
      );
    }

    const customizedMessage = this.formatMessage(dto.message, customer);
    try {
      await this.bot.telegram.sendMessage(
        customer.telegramChatId,
        customizedMessage,
      );
      return {
        success: true,
        message: `Notification sent successfully to ${customer.customerName}.`,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to send telegram message to customer ${customer.id}: ${error.message}`,
      );
      throw new BadRequestException(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Get linking status for all customers (or only linked customers)
   */
  async getLinkingStatus(linkedOnly?: boolean) {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .select([
        'customer.id',
        'customer.customerName',
        'customer.phoneNumber',
        'customer.telegramChatId',
        'customer.telegramUsername',
        'customer.telegramLinked',
      ]);

    if (linkedOnly) {
      query.where('customer.telegramChatId IS NOT NULL');
    }

    const customers = await query.getMany();
    return customers.map((customer) => ({
      id: customer.id,
      name: customer.customerName,
      phone: customer.phoneNumber || null,
      telegramLinked: !!customer.telegramChatId || customer.telegramLinked === 'true',
      telegramUsername: customer.telegramUsername || null,
      telegramChatId: customer.telegramChatId || null,
    }));
  }

  /**
   * Manually link a customer to a Telegram Chat ID via REST API
   */
  async linkManually(
    identifier: string,
    telegramChatId: string,
    telegramUsername?: string,
  ) {
    const searchStr = identifier.trim().toLowerCase();

    // Find customer by ID, telegramUsername, phoneNumber, customerName, or linked user email
    let customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('customer.id = :id', { id: identifier })
      .orWhere('LOWER(customer.telegramUsername) = :username', { username: searchStr.replace(/^@/, '') })
      .orWhere('customer.phoneNumber = :phone', { phone: identifier })
      .orWhere('LOWER(customer.customerName) = :name', { name: searchStr })
      .orWhere('LOWER(user.email) = :email', { email: searchStr })
      .getOne();

    if (!customer) {
      throw new NotFoundException(
        `No registered customer found matching: ${identifier}`,
      );
    }

    customer.telegramChatId = telegramChatId;
    customer.telegramLinked = 'true';
    if (telegramUsername) {
      customer.telegramUsername = telegramUsername.replace(/^@/, '');
    }

    await this.customerRepository.save(customer);
    this.logger.log(
      `Telegram customer account linked manually via API: ${customer.customerName} (${customer.id}) -> Chat ID: ${telegramChatId}`,
    );

    return {
      success: true,
      message: `Successfully linked customer ${customer.customerName} to Telegram Chat ID ${telegramChatId}.`,
      user: {
        id: customer.id,
        name: customer.customerName,
        phone: customer.phoneNumber || null,
        telegramLinked: true,
        telegramChatId: customer.telegramChatId,
        telegramUsername: customer.telegramUsername || null,
      },
    };
  }
}
