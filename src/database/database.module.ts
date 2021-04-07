import { Module } from '@nestjs/common';

import { MongoClient, Db, Logger } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          Logger.setLevel('debug');
          const client = await MongoClient.connect(
            'mongodb://budegaApi:seinao@localhost:27017/budega',
            {
              useUnifiedTopology: true,
            },
          );
          return client.db();
          // await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
        } catch (e) {
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
