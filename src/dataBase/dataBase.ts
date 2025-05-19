import { GameData, RoomDataItem, UserData, WinnerRecord } from '../types/types';
import * as WS from 'ws';

export const WSCLIENTS: Set<WS.WebSocket> = new Set();
export const USERS = new Map<string, UserData>();
export const ROOMS = new Map<string, RoomDataItem[]>();

export const GAMES = new Map<string, GameData>();
export const USER_TO_GAME = new Map<string, string>();

export const WINNERS: Map<string, WinnerRecord> = new Map();
