import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    const mockAuthService = {
        signIn: jest.fn().mockResolvedValue('fake-token'),
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('/auth/login (POST)', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({ id: 'user-1' })
            .expect(201)
            .expect('fake-token');

        expect(mockAuthService.signIn).toHaveBeenCalledWith('user-1');
    });
});
