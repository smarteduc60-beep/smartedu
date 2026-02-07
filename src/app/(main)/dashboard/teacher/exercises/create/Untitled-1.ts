/**
 * @file Geometry Interpreter
 * @description This module defines the types and functions for interpreting a series of geometry commands and rendering them onto a JSXGraph board.
 */

import JXG from 'jsxgraph';

/**
 * Defines the structure for a single geometry command.
 * Each command represents a geometric element to be drawn.
 */
export interface GeometryCommand {
  type: 'point' | 'line' | 'segment' | 'circle' | 'polygon' | 'angle' | 'text';
  id: string; // A unique identifier for the element.
  options: {
    name?: string;      // The label for the element.
    parents?: string[]; // IDs of parent elements (e.g., a line is defined by two points).
    [key: string]: any; // Other attributes for JSXGraph (e.g., color, size, fixed).
  };
}

/**
 * Renders a list of geometry commands onto a given JSXGraph board.
 *
 * @param board The JSXGraph board instance to draw on.
 * @param commands An array of GeometryCommand objects, or null.
 */
export function renderFromCommands(board: JXG.Board, commands: GeometryCommand[] | null): void {
  // Do nothing if the board or commands are not provided.
  if (!board || !commands) {
    return;
  }

  // Suspend board updates for better performance during bulk creation.
  board.suspendUpdate();

  // A map to store created elements by their ID, allowing them to be referenced as parents.
  const elements: { [id: string]: JXG.GeometryElement } = {};

  /**
   * A helper function to retrieve parent elements from the `elements` map.
   * @param parentIds An array of parent element IDs.
   * @returns An array of JSXGraph parent elements.
   */
  const getParents = (parentIds: string[] | undefined) => {
    if (!parentIds) return [];
    return parentIds.map(id => {
      const parent = elements[id];
      if (!parent) {
        console.error(`[GeometryInterpreter] Parent element with id "${id}" not found.`);
      }
      return parent;
    }).filter((p): p is JXG.GeometryElement => !!p); // Filter out any parents that were not found.
  };

  // Iterate over each command to create the corresponding geometric element.
  commands.forEach(command => {
    const { type, id, options } = command;
    const { parents: parentIds, ...attrs } = options;

    // Warn and skip if an element with the same ID already exists.
    if (elements[id]) {
      console.warn(`[GeometryInterpreter] Element with id "${id}" already exists. Skipping creation.`);
      return;
    }

    let element: JXG.GeometryElement | null = null;
    const parents = getParents(parentIds);

    try {
      switch (type) {
        case 'point':
          // A point is defined by its coordinates, e.g., [x, y].
          element = board.create('point', parentIds || [1, 1], attrs);
          break;

        case 'line':
          if (parents.length < 2) {
            console.error(`[GeometryInterpreter] Line with id "${id}" requires 2 parent points.`);
            break;
          }
          element = board.create('line', parents, attrs);
          break;

        case 'segment':
          if (parents.length < 2) {
            console.error(`[GeometryInterpreter] Segment with id "${id}" requires 2 parent points.`);
            break;
          }
          element = board.create('segment', parents, attrs);
          break;

        case 'circle':
          if (parents.length < 2) {
            console.error(`[GeometryInterpreter] Circle with id "${id}" requires a center point and another point/radius.`);
            break;
          }
          element = board.create('circle', parents, attrs);
          break;

        case 'polygon':
          if (parents.length < 3) {
            console.error(`[GeometryInterpreter] Polygon with id "${id}" requires at least 3 parent points.`);
            break;
          }
          element = board.create('polygon', parents, attrs);
          break;

        case 'angle':
          if (parents.length < 3) {
            console.error(`[GeometryInterpreter] Angle with id "${id}" requires 3 parent points.`);
            break;
          }
          element = board.create('angle', parents, attrs);
          break;

        case 'text':
          // Text requires coordinates and the string content, e.g., [x, y, "My Text"].
          const { x = 0, y = 0, textContent = '', ...textAttrs } = attrs;
          element = board.create('text', [x, y, textContent], textAttrs);
          break;

        default:
          console.warn(`[GeometryInterpreter] Unknown geometry command type: "${type}"`);
          break;
      }

      if (element) {
        elements[id] = element;
      }
    } catch (e) {
      console.error(`[GeometryInterpreter] Error creating element with id "${id}":`, e);
    }
  });

  // Resume board updates and perform a full redraw.
  board.unsuspendUpdate();
}
