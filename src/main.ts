import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// session.ts
import * as expressSession from 'express-session';

// DON'T use this in PRODUCTION
const memoryStore = new expressSession.MemoryStore();

export const session = expressSession({
  secret: '8021efef-62fe-4a5d-8573-4a681b039a45',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(session);
  await app.listen(3000);
}
bootstrap();
