import React, { useState } from 'react';
import Wall from '../Wall/Wall';
import { vec3 } from 'gl-matrix';

type MazeCell = {
    walls: {
        top: boolean,
        left: boolean
    },
    visited: boolean,
    x: number,
    y: number
}

function pickRandom<T>(a: Array<T>): T {
    return a[Math.floor(Math.random() * a.length)];
}

const generateMaze = (size: number, start: [number, number] = [0, 0]) => {
    const maze = new Array<Array<MazeCell>>();
    for (let y = 0; y < size; y++) {
        maze[y] = new Array<MazeCell>();
        for (let x = 0; x < size; x++) {
            maze[y][x] = {
                walls: {
                    top: true,
                    left: true,
                },
                visited: false,
                x,
                y,
            }
        }
    }

    const frontier = new Array<MazeCell>();
    const firstCell = maze[start[0]][start[1]];

    const printMaze = () => {
        let string = '';
        maze.forEach(row => {
            row.forEach(cell => {
                if (cell.walls.top) {
                    string += ' -';
                } else {
                    string += '  ';
                }
            })

            string += '\n';

            row.forEach(cell => {
                let s = frontier.includes(cell) ? 'x' : ' ';
                s = cell.visited ? 'o' : s;
                if (cell.walls.left) {
                    string += '|' + s;
                } else {
                    string += ' ' + s;
                }
            });

            string += '\n';
        });
        console.log(string);
    }

    const getNeighbors = (cell: MazeCell) => {
        const { x, y } = cell;
        const neighbors = [];
        if (x > 0) neighbors.push(maze[y][x - 1]);
        if (x < size - 1) neighbors.push(maze[y][x + 1]);
        if (y > 0) neighbors.push(maze[y - 1][x]);
        if (y < size - 1) neighbors.push(maze[y + 1][x]);
        return neighbors;
    }

    const visit = (cell: MazeCell) => {
        cell.visited = true;
        const neighbors = getNeighbors(cell);
        neighbors
            .filter(({ visited }) => !visited)
            .forEach(c => {
                frontier.push(c);
            });

        const visitedNeighbor = pickRandom(neighbors.filter(({ visited }) => visited));
        if (!visitedNeighbor) return;
        if (visitedNeighbor.x < cell.x) cell.walls.left = false;
        if (visitedNeighbor.y < cell.y) cell.walls.top = false;
        if (visitedNeighbor.x > cell.x) visitedNeighbor.walls.left = false;
        if (visitedNeighbor.y > cell.y) visitedNeighbor.walls.top = false;
    }
    
    visit(firstCell);
    let currentCell = firstCell;
    while (frontier.length) {
        currentCell = frontier.splice(frontier.findIndex(c => {
            return getNeighbors(currentCell).includes(c);
        }), 1)[0];
        visit(currentCell);
        // printMaze();
    }
    return maze;
}

const Maze: React.FC<{
    wallLength?: number
}> = ({wallLength = 1000, ...props}) => {
    const [maze] = useState(generateMaze(5));

    const getPosition = (x: number, y: number) => {
        // added offset temporarily for testing
        return vec3.fromValues(x * wallLength + 1000, 0, y * wallLength + 1000);
    }

    return (
        <>
        {
            maze.map((row, y) => row.map((cell, x) => {
                const leftWall = cell.walls.left ?
                    (<Wall position={getPosition(cell.x, cell.y)} yRotation={-0.5 * Math.PI} key={`left${x}${y}`}></Wall>) :
                    null;
                const topWall = cell.walls.top ?
                    (<Wall position={getPosition(cell.x, cell.y)} key={`top${x}${y}`}></Wall>) :
                    null;
                return [leftWall, topWall];
            }))
        }
        </>
    );
};

export default Maze;