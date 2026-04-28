import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    const mockAuthService = {
        signIn: jest.fn(),
    };

    const mockResponse = {
        redirect: jest.fn(),
        clearCookie: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
        jest.clearAllMocks();
        authController = new AuthController(mockAuthService as any);
        authService = mockAuthService as any;
    });

    describe('constructor', () => {
        it('should be defined', () => {
            expect(authController).toBeDefined();
        });
    });

    describe('login', () => {
        it('should return a token when login is called', async () => {
            const loginDto: LoginDto = {
                id: 'user-1',
                username: 'testuser',
            } as any;
            mockAuthService.signIn.mockResolvedValue('token-123');

            const result = await authController.login(mockResponse, loginDto);

            expect(result).toBe('token-123');
            expect(authService.signIn).toHaveBeenCalledWith('user-1');
        });

        it('should handle sign-in errors', async () => {
            const loginDto: LoginDto = {
                id: 'user-1',
                username: 'testuser',
            } as any;
            const error = new Error('Sign-in failed');
            mockAuthService.signIn.mockRejectedValue(error);

            await expect(authController.login(mockResponse, loginDto)).rejects.toThrow(
                'Sign-in failed',
            );
        });
    });

    describe('logout', () => {
        it('should handle logout', async () => {
            await authController.logout(mockResponse);

            expect(mockResponse.clearCookie).not.toHaveBeenCalled();
        });
    });

    describe('googleLogin', () => {
        it('should be defined', () => {
            expect(authController.googleLogin).toBeDefined();
        });
    });

    describe('googleCallback', () => {
        it('should redirect to client with token', async () => {
            const mockRequest = { user: { id: 'user-1' } };
            const consoleSpy = jest.spyOn(console, 'log');
            mockAuthService.signIn.mockResolvedValue('token-123');

            await authController.googleCallback(mockRequest, mockResponse);

            expect(authService.signIn).toHaveBeenCalledWith('user-1');
            expect(mockResponse.redirect).toHaveBeenCalledWith(
                expect.stringContaining('token=token-123'),
            );
            consoleSpy.mockRestore();
        });
    });
});
