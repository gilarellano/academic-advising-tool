import { Advisor } from '../../src/models/Advisor';

describe('Advisor Class', () => {
    it('should create an instance of Advisor with the correct properties', () => {
        const advisorID = 101;
        const name = 'Jane Doe';
        const email = 'jane.doe@example.com';
        const role = 'Advisor';
        const department = 'Computer Science';

        const advisor = new Advisor(advisorID, name, email, role, advisorID, department);

        expect(advisor).toBeInstanceOf(Advisor);
        expect(advisor.userID).toBe(advisorID);
        expect(advisor.name).toBe(name);
        expect(advisor.email).toBe(email);
        expect(advisor.role).toBe(role);
        expect(advisor.advisorID).toBe(advisorID);
        expect(advisor.department).toBe(department);
    });
});
