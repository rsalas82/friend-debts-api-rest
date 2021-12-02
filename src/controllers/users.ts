import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// getting all users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  // get some users
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/users`
  );
  let users: [User] = result.data;
  return res.status(200).json({
    message: users,
  });
};

// getting a single user
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  // get the user id from the req
  let id: string = req.params.id;
  // get the user
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  let user: User = result.data;
  return res.status(200).json({
    message: user,
  });
};

// updating a user
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  // get the user id from the req.params
  let id: string = req.params.id;
  // get the data from req.body
  let title: string = req.body.title ?? null;
  let body: string = req.body.body ?? null;
  // update the user
  let response: AxiosResponse = await axios.put(
    `https://jsonplaceholder.typicode.com/users/${id}`,
    {
      ...(title && { title }),
      ...(body && { body }),
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

// deleting a user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // get the user id from req.params
  let id: string = req.params.id;
  // delete the user
  let response: AxiosResponse = await axios.delete(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  // return response
  return res.status(200).json({
    message: "user deleted successfully",
  });
};

// adding a user
const addUser = async (req: Request, res: Response, next: NextFunction) => {
  // get the data from req.body
  let title: string = req.body.title;
  let body: string = req.body.body;
  // add the user
  let response: AxiosResponse = await axios.post(
    `https://jsonplaceholder.typicode.com/users`,
    {
      title,
      body,
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

export default { getUsers, getUser, updateUser, deleteUser, addUser };
