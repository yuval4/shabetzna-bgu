import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let authService: AuthService;
    const mockUsersService = {
        findOne: jest.fn(),
        findOneByEmail: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockUsersService as any, mockJwtService as any);
    });

    it('signs in an existing user and returns a token', async () => {
        mockUsersService.findOne.mockResolvedValue({ id: 'user-1' });
        mockJwtService.sign.mockReturnValue('jwt-token');

        const token = await authService.signIn('user-1');

        expect(token).toBe('jwt-token');
        expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1');
        expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 'user-1' });
    });

    it('throws UnauthorizedException when signIn fails', async () => {
        mockUsersService.findOne.mockRejectedValue(new Error('not found'));

        await expect(authService.signIn('missing')).rejects.toThrow(UnauthorizedException);
    });

    it('validates an existing Google user by email', async () => {
        const existingUser = { id: 'user-2', email: 'test@example.com' };
        mockUsersService.findOneByEmail.mockResolvedValue(existingUser);

        const result = await authService.validateGoogleUser({ email: 'test@example.com' } as any);

        expect(result).toEqual(existingUser);
        expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('throws when validateGoogleUser cannot find the email', async () => {
        mockUsersService.findOneByEmail.mockResolvedValue(null);

        await expect(
            authService.validateGoogleUser({ email: 'missing@example.com' } as any)
        ).rejects.toThrow(UnauthorizedException);
    });
});
