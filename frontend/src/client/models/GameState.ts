/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Position } from './Position';
export type GameState = {
    snake?: Array<Position>;
    food?: Position;
    direction?: GameState.direction;
    score?: number;
    gameOver?: boolean;
};
export namespace GameState {
    export enum direction {
        UP = 'UP',
        DOWN = 'DOWN',
        LEFT = 'LEFT',
        RIGHT = 'RIGHT',
    }
}

