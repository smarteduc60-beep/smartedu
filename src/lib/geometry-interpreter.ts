
import JXG from 'jsxgraph';

// --- TYPE DEFINITIONS ---

/**
 * Defines the basic structure for a command to draw a geometric object.
 */
export interface BaseCommand {
  id: string; // Unique identifier for the element
  type: 'point' | 'line' | 'segment' | 'circle' | 'angle' | 'polygon';
  options?: Record<string, any>; // JSXGraph attributes (color, size, name, etc.)
}

export interface PointCommand extends BaseCommand {
  type: 'point';
  position: [number, number]; // [x, y] coordinates
}

export interface LineCommand extends BaseCommand {
  type: 'line';
  points: [string, string]; // IDs of two points defining the line
}

export interface SegmentCommand extends BaseCommand {
  type: 'segment';
  points: [string, string]; // IDs of two points defining the segment
}

export interface CircleCommand extends BaseCommand {
  type: 'circle';
  center: string; // ID of the center point
  radius: number | string; // A fixed radius or ID of a point on the circumference
}

export interface PolygonCommand extends BaseCommand {
  type: 'polygon';
  points: string[]; // An array of point IDs
}

export interface AngleCommand extends BaseCommand {
  type: 'angle';
  points: [string, string, string]; // [point1, vertex, point2]
}

/**
 * A union type representing any possible geometry command.
 */
export type GeometryCommand =
  | PointCommand
  | LineCommand
  | SegmentCommand
  | CircleCommand
  | PolygonCommand
  | AngleCommand;

// --- RENDERER ---

/**
 * Renders a geometric diagram on a JSXGraph board from a list of commands.
 *
 * @param board The JSXGraph board instance to draw on.
 * @param commands An array of GeometryCommand objects.
 * @returns A map of created JXG.Elements, indexed by their command ID.
 */
export function renderFromCommands(
  board: JXG.Board,
  commands: GeometryCommand[]
): Map<string, JXG.GeometryElement> {
  const elements = new Map<string, JXG.GeometryElement>();

  if (!commands || !Array.isArray(commands)) {
    return elements;
  }

  // --- 1. Auto-scale Bounding Box ---
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let hasPoints = false;

  commands.forEach((cmd) => {
    if (cmd.type === 'point') {
      const [x, y] = cmd.position;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      hasPoints = true;
    }
  });

  if (hasPoints) {
    const padding = 3; // Add padding around the drawing
    // JSXGraph bounding box: [left, top, right, bottom]
    // Note: Y-axis is standard Cartesian (up is positive), so top > bottom
    board.setBoundingBox([minX - padding, maxY + padding, maxX + padding, minY - padding]);
  }

  // Create points first, as other elements depend on them
  commands
    .filter((cmd): cmd is PointCommand => cmd.type === 'point')
    .forEach((cmd) => {
      const { id, position, options = {} } = cmd;
      const point = board.create('point', position, { name: id, ...options });
      elements.set(id, point);
    });

  // Create other elements
  commands
    .filter((cmd) => cmd.type !== 'point')
    .forEach((cmd) => {
      const { id, options = {} } = cmd;
      
      if (!cmd.type) {
        console.warn(`Skipping command with missing type:`, cmd);
        return;
      }

      let element: JXG.GeometryElement | null = null;
      const allOptions = { name: cmd.options?.name ?? '', ...options };

      try {
        switch (cmd.type) {
          case 'line': {
            const [p1, p2] = cmd.points.map(pId => elements.get(pId));
            if (p1 && p2) {
              element = board.create('line', [p1, p2], allOptions);
            }
            break;
          }

          case 'segment': {
            const [p1, p2] = cmd.points.map(pId => elements.get(pId));
            if (p1 && p2) {
              element = board.create('segment', [p1, p2], allOptions);
            }
            break;
          }

          case 'circle': {
            const center = elements.get(cmd.center);
            if (center) {
              if (typeof cmd.radius === 'number') {
                element = board.create('circle', [center, cmd.radius], allOptions);
              } else {
                const radiusPoint = elements.get(cmd.radius);
                if (radiusPoint) {
                  element = board.create('circle', [center, radiusPoint], allOptions);
                }
              }
            }
            break;
          }

          case 'polygon': {
            const polygonPoints = cmd.points.map(pId => elements.get(pId)).filter(Boolean) as JXG.Point[];
            if (polygonPoints.length === cmd.points.length) {
              element = board.create('polygon', polygonPoints, allOptions);
            }
            break;
          }

          case 'angle': {
             const [p1, vertex, p2] = cmd.points.map(pId => elements.get(pId));
             if (p1 && vertex && p2) {
                // Check if the name implies a measurement (e.g. "90°")
                const providedName = allOptions.name;
                const isMeasurement = typeof providedName === 'string' && /^\d+°?$/.test(providedName);
                
                if (isMeasurement) {
                    delete allOptions.name;
                }

                element = board.create('angle', [p1, vertex, p2], allOptions);

                if (isMeasurement && element) {
                    (element as any).label.setText(() => ((element as any).Value() * 180 / Math.PI).toFixed(0) + '°');
                }
             }
             break;
          }
        }

        if (element) {
          elements.set(id, element);
        } else {
          console.warn(`Could not create element '${id}' of type '${cmd.type}'. Check dependencies.`);
        }
      } catch (error) {
        console.error(`Error creating element '${id}':`, error);
      }
    });

  board.unsuspendUpdate();
  return elements;
}
