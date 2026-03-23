export type GeometryCommand = {
  command: string;
  id: string;
  [key: string]: any;
};

export const renderFromCommands = (board: any, commandsToRender: GeometryCommand[] = []): void => {
  console.log('[GeometryInterpreter] renderFromCommands called', {
    boardDefined: !!board,
    container: board?.container,
    boundingBox: board?.getBoundingBox ? board.getBoundingBox() : 'N/A',
    commandsCount: commandsToRender?.length
  });

  const elements = new Map<string, any>();
  let bbox = [-5, 5, 5, -5];

  if (typeof board?.suspendUpdate === 'function') {
    board.suspendUpdate();
  }

  try {
    for (const cmd of commandsToRender || []) {
      console.log(`[GeometryInterpreter] Processing command: ${cmd.command} (${cmd.id})`, cmd);
      try {
        switch (cmd.command) {
          case 'create_point': {
            const point = board.create('point', cmd.at, {
              name: cmd.label || '',
              fixed: !cmd.isFree,
              size: 3,
              color: '#3B82F6',
              label: { offset: [10, 10] }
            });
            elements.set(cmd.id, point);
            break;
          }

          case 'create_segment': {
            const p1Id = cmd.from || (cmd.points && cmd.points[0]);
            const p2Id = cmd.to || (cmd.points && cmd.points[1]);
            const p1 = elements.get(p1Id);
            const p2 = elements.get(p2Id);
            if (p1 && p2) {
              const segment = board.create('segment', [p1, p2]);
              elements.set(cmd.id, segment);
            } else {
              console.warn(`[GeometryInterpreter] create_segment failed: Missing points. p1(${p1Id}):${!!p1}, p2(${p2Id}):${!!p2}`);
            }
            break;
          }

          case 'create_polygon': {
            const pts = Array.isArray(cmd.points) ? cmd.points.map((id: string) => elements.get(id)).filter(Boolean) : [];
            if (pts.length === (cmd.points?.length || 0)) {
              const polygon = board.create('polygon', pts, {
                fillColor: '#BFDBFE',
                fillOpacity: 0.3,
                borders: { strokeColor: '#60A5FA' }
              });
              elements.set(cmd.id, polygon);
            } else {
              console.warn(`[GeometryInterpreter] create_polygon failed: Missing points. Expected ${cmd.points?.length || 0}, found ${pts.length}`);
            }
            break;
          }

          case 'create_line': {
            const p1Id = cmd.from || (cmd.points && cmd.points[0]);
            const p2Id = cmd.to || (cmd.points && cmd.points[1]);
            const p1 = elements.get(p1Id);
            const p2 = elements.get(p2Id);
            if (p1 && p2) {
              const line = board.create('line', [p1, p2], {
                strokeColor: '#9CA3AF',
                strokeWidth: 1,
              });
              elements.set(cmd.id, line);
            } else {
              console.warn(`[GeometryInterpreter] create_line failed: Missing points. p1(${p1Id}):${!!p1}, p2(${p2Id}):${!!p2}`);
            }
            break;
          }

          case 'create_circle': {
            const center = elements.get(cmd.center);
            if (center) {
              const circle = board.create('circle', [center, cmd.radius], {
                strokeColor: '#F87171',
                strokeWidth: 2,
              });
              elements.set(cmd.id, circle);
            } else {
              console.warn(`[GeometryInterpreter] create_circle failed: Center point ${cmd.center} not found`);
            }
            break;
          }

          case 'create_perpendicular': {
            const line = elements.get(cmd.on);
            const point = elements.get(cmd.at);
            if (line && point) {
              const perp = board.create('perpendicular', [line, point], {
                strokeColor: '#A78BFA',
                strokeWidth: 1,
                dash: 2,
              });
              elements.set(cmd.id, perp);
            } else {
              console.warn(`[GeometryInterpreter] create_perpendicular failed: Line ${cmd.on} or Point ${cmd.at} not found`);
            }
            break;
          }

          case 'create_point_on_path': {
            const path = elements.get(cmd.on);
            if (path) {
              const val = cmd.distance || 1;
              const point = board.create('glider', [val, val, path], {
                name: cmd.label || '',
                size: 3,
                color: '#3B82F6'
              });
              elements.set(cmd.id, point);
            } else {
              console.warn(`[GeometryInterpreter] create_point_on_path failed: Path ${cmd.on} not found`);
            }
            break;
          }

          case 'create_midpoint': {
            const points = cmd.of || cmd.points || [];
            const p1 = elements.get(points[0]);
            const p2 = elements.get(points[1]);
            if (p1 && p2) {
              const midpoint = board.create('midpoint', [p1, p2], {
                name: cmd.label || '',
                size: 2,
                color: '#34D399',
                fixed: true,
              });
              elements.set(cmd.id, midpoint);
            } else {
              console.warn(`[GeometryInterpreter] create_midpoint failed: Points not found`);
            }
            break;
          }

          case 'create_parallel': {
            const line = elements.get(cmd.on);
            const point = elements.get(cmd.at);
            if (line && point) {
              const parallel = board.create('parallel', [line, point], {
                strokeColor: '#9CA3AF',
                strokeWidth: 1,
                dash: 2,
              });
              elements.set(cmd.id, parallel);
            } else {
              console.warn(`[GeometryInterpreter] create_parallel failed: Line ${cmd.on} or Point ${cmd.at} not found`);
            }
            break;
          }

          case 'create_intersection': {
            const obj1 = elements.get(cmd.between?.[0]);
            const obj2 = elements.get(cmd.between?.[1]);
            if (obj1 && obj2) {
              const intersection = board.create('intersection', [obj1, obj2, 0], {
                name: cmd.label || '',
                size: 3,
                color: '#4B5563'
              });
              elements.set(cmd.id, intersection);
            } else {
              console.warn(`[GeometryInterpreter] create_intersection failed: Objects ${cmd.between} not found`);
            }
            break;
          }

          case 'create_circumcircle': {
            const p1 = elements.get(cmd.points?.[0]);
            const p2 = elements.get(cmd.points?.[1]);
            const p3 = elements.get(cmd.points?.[2]);
            if (p1 && p2 && p3) {
              const circle = board.create('circumcircle', [p1, p2, p3], {
                strokeColor: '#F87171',
                strokeWidth: 2,
                dash: 2
              });
              elements.set(cmd.id, circle);
            } else {
              console.warn(`[GeometryInterpreter] create_circumcircle failed: Points not found`);
            }
            break;
          }

          case 'create_arc': {
            const p1 = elements.get(cmd.points?.[0]);
            const p2 = elements.get(cmd.points?.[1]);
            const p3 = elements.get(cmd.points?.[2]);
            if (p1 && p2 && p3) {
              const arc = board.create('arc', [p1, p2, p3], {
                strokeColor: '#F87171',
                strokeWidth: 2,
              });
              elements.set(cmd.id, arc);
            } else {
              console.warn(`[GeometryInterpreter] create_arc failed: Points not found`);
            }
            break;
          }

          case 'measure_angle': {
            const p1 = elements.get(cmd.points?.[0]);
            const p2 = elements.get(cmd.points?.[1]);
            const p3 = elements.get(cmd.points?.[2]);
            if (p1 && p2 && p3) {
              board.create('angle', [p1, p2, p3], {
                name: cmd.label || '',
                radius: 1,
                color: '#FB923C',
              });
            } else {
              console.warn(`[GeometryInterpreter] measure_angle failed: Points not found`);
            }
            break;
          }

          case 'create_perpendicular_bisector': {
            const p1 = elements.get(cmd.points?.[0]);
            const p2 = elements.get(cmd.points?.[1]);
            if (p1 && p2) {
              const bisector = board.create('perpendicularbisector', [p1, p2], {
                strokeColor: '#9CA3AF',
                strokeWidth: 1,
                dash: 2
              });
              elements.set(cmd.id, bisector);
            } else {
              console.warn(`[GeometryInterpreter] create_perpendicular_bisector failed: Points not found`);
            }
            break;
          }

          case 'create_angle_bisector': {
            const p1 = elements.get(cmd.points?.[0]);
            const vertex = elements.get(cmd.points?.[1]);
            const p2 = elements.get(cmd.points?.[2]);
            if (p1 && vertex && p2) {
              const bisector = board.create('bisector', [p1, vertex, p2], {
                strokeColor: '#9CA3AF',
                strokeWidth: 1,
                dash: 2
              });
              elements.set(cmd.id, bisector);
            } else {
              console.warn(`[GeometryInterpreter] create_angle_bisector failed: Points not found`);
            }
            break;
          }

          case 'create_text': {
            if (Array.isArray(cmd.at) && typeof cmd.text === 'string') {
              const text = board.create('text', [cmd.at[0], cmd.at[1], cmd.text], { fontSize: 16 });
              elements.set(cmd.id, text);
            }
            break;
          }

          default:
            console.warn(`[GeometryInterpreter] Unknown command: ${cmd.command}`, cmd);
            break;
        }
      } catch (err) {
        console.error(`[GeometryInterpreter] Error executing command ${cmd.command}:`, err);
      }
    }

    // apply bbox and update after processing commands
    try {
      if (typeof board?.setBoundingBox === 'function') {
        board.setBoundingBox(bbox);
      }
      if (typeof board?.update === 'function') {
        board.update();
      }
    } catch (err) {
      console.warn('[GeometryInterpreter] Failed to set bbox/update board:', err);
    }
  } finally {
    if (typeof board?.unsuspendUpdate === 'function') {
      board.unsuspendUpdate();
      console.log('[GeometryInterpreter] Board update unsuspended. Elements count:', elements.size);
    }
  }
};
