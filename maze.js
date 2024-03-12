"use strict"
function generateMaze() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    
    const maze = generate(rows, cols);

    displayMaze(maze);
    console.log(JSON.stringify(maze));
}

function generate(rows, cols) {
    const maze = Array.from({ length: rows }, () => 
                    Array.from({ length: cols }, () => 
                        ({ north: true, east: true, south: true, west: true })
                    )
                );

    const stack = [];
    let current = { row: Math.floor(Math.random() * rows), col: Math.floor(Math.random() * cols) };
    stack.push(current);

    while (stack.length > 0) {
        let neighbors = getUnvisitedNeighbors(current, maze);

        if (neighbors.length > 0) {
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWall(current, next, maze);
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }

    // Set start and goal
    maze[0][0].west = false;
    maze[rows - 1][cols - 1].east = false;

    return {
        rows: rows,
        cols: cols,
        start: { row: 0, col: 0 },
        goal: { row: rows - 1, col: cols - 1 },
        maze: maze
    };
}

function getUnvisitedNeighbors(cell, maze) {
    const { row, col } = cell;
    const neighbors = [];

    if (row > 0 && maze[row - 1][col].north) {
        neighbors.push({ row: row - 1, col });
    }
    if (col < maze[0].length - 1 && maze[row][col + 1].east) {
        neighbors.push({ row, col: col + 1 });
    }
    if (row < maze.length - 1 && maze[row + 1][col].south) {
        neighbors.push({ row: row + 1, col });
    }
    if (col > 0 && maze[row][col - 1].west) {
        neighbors.push({ row, col: col - 1 });
    }

    return neighbors;
}

function removeWall(current, next, maze) {
    if (current.row === next.row) {
        if (current.col < next.col) {
            maze[current.row][current.col].east = false;
            maze[next.row][next.col].west = false;
        } else {
            maze[current.row][current.col].west = false;
            maze[next.row][next.col].east = false;
        }
    } else {
        if (current.row < next.row) {
            maze[current.row][current.col].south = false;
            maze[next.row][next.col].north = false;
        } else {
            maze[current.row][current.col].north = false;
            maze[next.row][next.col].south = false;
        }
    }
}

function displayMaze(mazeData) {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';

    for (let i = 0; i < mazeData.rows; i++) {
        for (let j = 0; j < mazeData.cols; j++) {
            const cell = mazeData.maze[i][j];
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            if (cell.north) cellDiv.classList.add('north');
            if (cell.east) cellDiv.classList.add('east');
            if (cell.south) cellDiv.classList.add('south');
            if (cell.west) cellDiv.classList.add('west');
            mazeContainer.appendChild(cellDiv);
        }
    }
}
