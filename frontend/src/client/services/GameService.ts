/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivePlayer } from '../models/ActivePlayer';
import type { GameState } from '../models/GameState';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GameService {
    /**
     * Get a list of currently active players
     * @returns ActivePlayer List of active players
     * @throws ApiError
     */
    public static getGamesActive(): CancelablePromise<Array<ActivePlayer>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/active',
        });
    }
    /**
     * Get the real-time game state for a specific player
     * @param playerId
     * @returns GameState Current game state
     * @throws ApiError
     */
    public static getGames(
        playerId: string,
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/{playerId}',
            path: {
                'playerId': playerId,
            },
            errors: {
                404: `Player or game not found`,
            },
        });
    }
}
