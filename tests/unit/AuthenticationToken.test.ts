import { AuthenticationToken } from '../../src/models/AuthenticationToken';
import { SystemUser } from '../../src/models/SystemUser';

describe('AuthenticationToken', () => {
    const user = new SystemUser(1, 'John Doe', 'example@mail.com', 'Advisor');

    it('should return false for isExpired if the token expiry is in the future', () => {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1) // Set expiry date one hour into the future
        
        const token = new AuthenticationToken(1, 'token_string', futureDate, user);

        expect(token.isExpired()).toBe(false);
    });

    it('should return true for isExpired if the token expiry is in the past', () => {
        const pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 1) // Set expiry date one hour into the future
        
        const token = new AuthenticationToken(2, 'token_string', pastDate, user);

        expect(token.isExpired()).toBe(true);
    });

});