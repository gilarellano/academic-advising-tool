// SystemUserController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../../database/DataSource";
import { SystemUserService } from "../../services/SystemUserService";

export class SystemUserController {
  systemUserService: SystemUserService;

  constructor() {
    this.systemUserService = new SystemUserService(AppDataSource);
  }

  // Create a new system user
  public createUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { name, email, role, password } = req.body;
      if (!name || !email || !role || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newUser = await this.systemUserService.createUser(
        name,
        email,
        role,
        password
      );
      return res.status(201).json(newUser);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  // Update user details
  public updateUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = parseInt(req.params.userId);
      const { name, email, role, password } = req.body;
      
      console.log(userId, name, email, role, password);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }

      //Update name if provided
      if (name) {
        await this.systemUserService.updateUserName(userId, name);
        console.log("Updated User Name!")
      }

      // Update email if provided
      if (email) {
        await this.systemUserService.updateUserEmail(userId, email);
        console.log("Updated User Email!")
      }

      // Update role if provided
      if (role) {
        await this.systemUserService.updateUserRole(userId, role);
        console.log("Updated role!")
      }

      // Update password if provided
      if (password) {
        await this.systemUserService.updateUserPassword(userId, password);
        console.log("Updated pass!")
      }

      console.log("Successfully updated info")
      return res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  // Fetch a user by ID
  public getUserById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = parseInt(req.params.userId);
      const user = await this.systemUserService.findUserByID(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  public updateUserName = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = parseInt(req.params.userId);
      const { newName } = req.body;
      if (!newName) {
        return res.status(400).json({ message: "New name must be provided" });
      }
      await this.systemUserService.updateUserName(userId, newName);
      return res
        .status(200)
        .json({ message: "User name updated successfully" });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userID = parseInt(req.params.userId);
      await this.systemUserService.deleteSystemUser(userID);
      return res.status(204).json();
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  public loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password must be provided" });
      }
      const loginSuccessful = await this.systemUserService.loginUser(
        email,
        password
      );
      return res
        .status(200)
        .json({
          message: "Login successful",
          isAuthenticated: loginSuccessful,
        });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(401).json({ message: errorMessage });
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      let page = parseInt(req.query.page as string);
      let limit = parseInt(req.query.limit as string);

      // Ensure the parsed numbers are positive integers; otherwise, default them
      page = isNaN(page) || page < 1 ? 1 : page;
      limit = isNaN(limit) || limit < 1 ? 10 : limit;

      const users = await this.systemUserService.retrieveAllUsers(page, limit);
      return res.status(200).json({
        data: users,
        page,
        limit,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res.status(500).json({ message: errorMessage });
    }
  };

  // Method to check email existence
  public checkEmailExists = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }
    try {
      const exists = await this.systemUserService.emailExists(email);
      return res.json({ exists });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return res
        .status(500)
        .json({ message: "Error checking email existence", errorMessage });
    }
  };
}

// Export the controller as a singleton
export default new SystemUserController();
