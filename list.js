const fs = require('fs');
const path = require('path');

// Function to list directories and files up to a specified depth
const listDirectories = (dir, level = 0, maxDepth = 2) => {
    if (level > maxDepth) return; // Limit depth to maxDepth

    const items = fs.readdirSync(dir);

    items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        // Check if it's a directory
        if (stats.isDirectory()) {
            console.log(`${'  '.repeat(level)}- ${item}/`);
            listDirectories(itemPath, level + 1, maxDepth); // Recurse into the directory
        } else {
            console.log(`${'  '.repeat(level)}- ${item}`);
        }
    });
};

// Start listing from the current directory
listDirectories(__dirname);
