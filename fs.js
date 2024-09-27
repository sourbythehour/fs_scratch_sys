(function (Scratch) {
  'use strict';

  // Check if the environment is not a browser sandbox
  if (typeof require !== 'undefined') {
    const fs = require('fs'); // Node.js FileSystem module

    // Create a function to list all files in a directory recursively
    function getAllFiles(dirPath, arrayOfFiles = []) {
      const files = fs.readdirSync(dirPath);

      files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
          arrayOfFiles.push(dirPath + "/" + file);
        }
      });

      return arrayOfFiles;
    }

    // Create a function to write a new file
    function writeFile(filePath, content) {
      fs.writeFileSync(filePath, content, 'utf8');
    }

    // Define the extension
    class FileSystemExtension {
      getInfo() {
        return {
          id: 'fileSystem',
          name: 'File System',
          blocks: [
            {
              opcode: 'listFiles',
              blockType: Scratch.BlockType.REPORTER,
              text: 'list all files in [DIRECTORY]',
              arguments: {
                DIRECTORY: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '/'
                }
              }
            },
            {
              opcode: 'createFile',
              blockType: Scratch.BlockType.COMMAND,
              text: 'create file [FILE] with content [CONTENT]',
              arguments: {
                FILE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '/path/to/file.txt'
                },
                CONTENT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Hello, World!'
                }
              }
            }
          ]
        };
      }

      // Implementing the blocks
      listFiles(args) {
        return JSON.stringify(getAllFiles(args.DIRECTORY));
      }

      createFile(args) {
        writeFile(args.FILE, args.CONTENT);
      }
    }

    // Register the extension
    Scratch.extensions.register(new FileSystemExtension());
  }
})(Scratch);
