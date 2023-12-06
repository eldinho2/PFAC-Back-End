import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const redisURL = process.env.REDIS_URL;

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient: ReturnType<typeof createClient>;

  async connectToRedis(): Promise<void> {
    this.pubClient = createClient({ url: redisURL });
    const subClient = this.pubClient.duplicate();
    this.pubClient.on('error', (err) => {
      console.error('Erro no cliente Redis (publicação):', err);
    });
    subClient.on('error', (err) => {
      console.error('Erro no cliente Redis (subscrição):', err);
    });

    await Promise.all([this.pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(this.pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    server.adapter(this.adapterConstructor);
    return server;
  }

  async storeMessage(conversationId: string, message: any): Promise<number> {
    if (!this.pubClient) {
      await this.connectToRedis();
    }
    try {
      const messageStr =
        typeof message === 'string' ? message : JSON.stringify(message);
      const result = await this.pubClient.rPush(conversationId, messageStr);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getMessages(conversationId: string): Promise<string[]> {
    if (!this.pubClient) {
      await this.connectToRedis();
    }
    try {
      const result = await this.pubClient.lRange(conversationId, 0, -1);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
