(function (Scratch) {
  'use strict';

  class Matrix {
    constructor(elements) {
      this.elements = elements;
    }

    multiply(other) {
      const a = this.elements;
      const b = other.elements;
      const result = [];

      for (let i = 0; i < 4; i++) {
        result[i] = [];
        for (let j = 0; j < 4; j++) {
          result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j] + a[i][3] * b[3][j];
        }
      }

      return new Matrix(result);
    }

    static identity() {
      return new Matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
    }

    static rotationX(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return new Matrix([
        [1, 0, 0, 0],
        [0, c, -s, 0],
        [0, s, c, 0],
        [0, 0, 0, 1]
      ]);
    }

    static rotationY(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return new Matrix([
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1]
      ]);
    }

    static rotationZ(angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return new Matrix([
        [c, -s, 0, 0],
        [s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ]);
    }
  }

  class Vector {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    applyMatrix(matrix) {
      const e = matrix.elements;
      const x = this.x * e[0][0] + this.y * e[1][0] + this.z * e[2][0] + e[3][0];
      const y = this.x * e[0][1] + this.y * e[1][1] + this.z * e[2][1] + e[3][1];
      const z = this.x * e[0][2] + this.y * e[1][2] + this.z * e[2][2] + e[3][2];
      return new Vector(x, y, z);
    }
  }

  class CFrame {
    constructor(x, y, z, rx, ry, rz) {
      this.position = new Vector(x, y, z);
      this.rotation = Matrix.rotationX(rx)
        .multiply(Matrix.rotationY(ry))
        .multiply(Matrix.rotationZ(rz));
    }

    transformPoint(point) {
      return point.applyMatrix(this.rotation).applyMatrix(new Matrix([
        [1, 0, 0, this.position.x],
        [0, 1, 0, this.position.y],
        [0, 0, 1, this.position.z],
        [0, 0, 0, 1]
      ]));
    }
  }

  class Simple3DExtension {
    constructor() {
      this.points = []; // Stores 3D points as {x, y, z}
      this.camera = { x: 0, y: 0, z: -5, rx: 0, ry: 0, rz: 0 }; // Default camera position and rotation
    }

    getInfo() {
      return {
        id: 'simple3DRenderer',
        name: 'Advanced 3D Renderer',
        blocks: [
          {
            opcode: 'add3DPoint',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add 3D point x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'clearPoints',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Clear all 3D points'
          },
          {
            opcode: 'draw3DLine',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Draw line from point [A] to point [B]',
            arguments: {
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set camera position x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: -5 }
            }
          },
          {
            opcode: 'setCameraRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set camera rotation rx: [RX] ry: [RY] rz: [RZ]',
            arguments: {
              RX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'getCameraPosition',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Camera [PROP]',
            arguments: {
              PROP: {
                type: Scratch.ArgumentType.STRING,
                menu: 'cameraProperties',
                defaultValue: 'x'
              }
            }
          },
          {
            opcode: 'createCFrame',
            blockType: Scratch.BlockType.REPORTER,
            text: 'CFrame x: [X] y: [Y] z: [Z] rx: [RX] ry: [RY] rz: [RZ]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              RZ: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'addMesh',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add mesh [MESH] at x: [X] y: [Y] z: [Z]',
            arguments: {
              MESH: {
                type: Scratch.ArgumentType.STRING,
                menu: 'meshTypes',
                defaultValue: 'cube'
              },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          }
        ],
        menus: {
          cameraProperties: {
            items: ['x', 'y', 'z', 'rx', 'ry', 'rz']
          },
          meshTypes: {
            items: ['cube', 'sphere', 'pyramid']
          }
        }
      };
    }

    add3DPoint(args) {
      const x = parseFloat(args.X);
      const y = parseFloat(args.Y);
      const z = parseFloat(args.Z);
      this.points.push(new Vector(x, y, z));
    }

    clearPoints() {
      this.points = [];
    }

    setCameraPosition(args) {
      this.camera.x = parseFloat(args.X);
      this.camera.y = parseFloat(args.Y);
      this.camera.z = parseFloat(args.Z);
    }

    setCameraRotation(args) {
      this.camera.rx = parseFloat(args.RX);
      this.camera.ry = parseFloat(args.RY);
      this.camera.rz = parseFloat(args.RZ);
    }

    getCameraPosition(args) {
      const prop = args.PROP;
      if (['x', 'y', 'z', 'rx', 'ry', 'rz'].includes(prop)) {
        return this.camera[prop].toString();
      }
      return '0';
    }

    createCFrame(args) {
      return new CFrame(parseFloat(args.X), parseFloat(args.Y), parseFloat(args.Z), parseFloat(args.RX), parseFloat(args.RY), parseFloat(args.RZ));
    }

    addMesh(args) {
      const type = args.MESH;
      const x = parseFloat(args.X);
      const y = parseFloat(args.Y);
      const z = parseFloat(args.Z);
      // Handle adding the mesh shape (cube, sphere, etc.) at position (x, y, z)
    }
  }

  Scratch.extensions.register(new Simple3DExtension());
})(Scratch);
