import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import apiResponse from "../utils/response-handler";
import { ResponseMessage } from "~/config/constants";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    // add access authentication
    const { page, size } = req.body
    const options = {
      page: page || 1,
      limit: size || 10,
    }
    const users = await User.paginate({}, options);
     res.status(200).json(apiResponse({
      object: users,
      message: ResponseMessage.GETUSERS
     }))
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    // add access authentication
    const {id} = req.params;
    const user = await User.findById(id);
    res.status(200).json(apiResponse({
      object: user,
      message: ResponseMessage.GETUSER
     }))
  } catch (err) {
    next(err);
  }
}

export async function updateUserById(req: Request, res: Response, next: NextFunction) {
  try {
    // update validation
    const {id} = req.body;
    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json(apiResponse({
      object: user,
      message: ResponseMessage.UPDATEUSER
     }))
  } catch (err) {
    next(err);
  }
}