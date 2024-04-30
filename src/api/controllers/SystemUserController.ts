// SystemUserController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../../database/DataSource';
import { SystemUserService } from '../../services/SystemUserService';

export class SystemUserController {
    systemUserService: SystemUserService;

    constructor() {
        this.systemUserService = new SystemUserService(AppDataSource);
    }

    // Create a new system user
    public createUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, email, role, password } = req.body;
            if (!name || !email || !role || !password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newUser = await this.systemUserService.createUser(name, email, role, password);
            return res.status(201).json(newUser);
        } catch (error) {
          const errorMessage = (error as Error).message;
          return res.status(500).json({ message: errorMessage});
        }
    };

    // Fetch a user by ID
    public getUserById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = parseInt(req.params.userId);
            const user = await this.systemUserService.userRepository.findUserById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
          const errorMessage = (error as Error).message;
          return res.status(500).json({ message: errorMessage});
        }
    };

    // Update a user's name
    public updateUserName = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = parseInt(req.params.userId);
            const { newName } = req.body;
            if (!newName) {
                return res.status(400).json({ message: "New name must be provided" });
            }
            await this.systemUserService.userRepository.updateUserName(userId, newName);
            return res.status(200).json({ message: "User name updated successfully" });
        } catch (error) {
          const errorMessage = (error as Error).message;
          return res.status(500).json({ message: errorMessage});
        }
    };

    // Delete a user
    public deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = parseInt(req.params.userId);
            await this.systemUserService.userRepository.deleteSystemUser(userId);
            return res.status(204).json(); // No Content
        } catch (error) {
          const errorMessage = (error as Error).message;
          return res.status(500).json({ message: errorMessage});
        }
    };

    // User login
    public loginUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password must be provided" });
            }
            const loginSuccessful = await this.systemUserService.loginUser(email, password);
            return res.status(200).json({ message: "Login successful", isAuthenticated: loginSuccessful });
        } catch (error) {
          const errorMessage = (error as Error).message;
          return res.status(401).json({ message: errorMessage});
        }
    };
}

// Export the controller as a singleton
export default new SystemUserController();
