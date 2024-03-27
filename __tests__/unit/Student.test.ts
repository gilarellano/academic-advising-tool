// src/models/__tests__/Student.test.ts

import { Student } from '../../src/models/Student';

describe('SystemUser', () => {
  it('should construct a SystemUser object properly', () => {
    const userID = 1;
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const role = 'Student';
    const studentID = 123456;
    const degreeProgram = 'Computer Science';
    const currentCredits = 30;

    const student = new Student(userID, name, email, role, studentID, degreeProgram, currentCredits);

    expect(student).toBeInstanceOf(Student);
    expect(student.userID).toBe(userID);
    expect(student.name).toBe(name);
    expect(student.email).toBe(email);
    expect(student.role).toBe(role);
    expect(student.studentID).toBe(studentID);
    expect(student.degreeProgram).toBe(degreeProgram);
    expect(student.currentCredits).toBe(currentCredits);
  });
});
