import express from 'express';
import { User } from 'better-auth';
import { Session } from './session.model';

export interface CustomRequest extends express.Request {
  user: User;
  session: Session;
}