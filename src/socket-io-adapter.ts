import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { JwtPayload } from './auth/jwt-payload.interface';
import { SocketWithAuth } from './tournaments/dto/join-tournament.dto';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('tournaments').use(createTokenMiddleware(this.jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  async (socket: SocketWithAuth, next) => {

    // for Postman testing support, fallback to token header
    const headers = socket.handshake.headers;
    const token = socket.handshake.auth.token || headers['token'];
    const tournamentId : any = headers['tournamentid'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload : JwtPayload = await jwtService.verifyAsync(token);
      socket.username = payload.username;
      socket.userId = payload.userId;
      socket.tournamentId = tournamentId;
      next();
    } catch {
      logger.debug(`User unauthorized!`);
      next(new Error('FORBIDDEN'));
    }
  };
