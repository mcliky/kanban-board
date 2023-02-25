import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './kanban.css';

const tasks = {
  'task-1': {
    id: 'task-1',
    title: 'Task 1',
    description: 'Do something',
    status: 'todo',
  },
  'task-2': {
    id: 'task-2',
    title: 'Task 2',
    description: 'Do something else',
    status: 'in-progress',
  },
  'task-3': {
    id: 'task-3',
    title: 'Task 3',
    description: 'Do something more',
    status: 'done',
  },
};

function App() {
  const [taskState, setTaskState] = useState({
    tasks: tasks,
    columns: {
      'todo': {
        id: 'todo',
        title: 'Todo',
        taskIds: ['task-1']
      },
      'in-progress': {
        id: 'in-progress',
        title: 'In Progress',
        taskIds: ['task-2']
      },
      'done': {
        id: 'done',
        title: 'Done',
        taskIds: ['task-3']
      }
    },
    columnOrder: ['todo', 'in-progress', 'done']
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Check if the draggable item was dropped outside of any droppable area
    if (!destination) {
      return;
    }

    // Check if the draggable item was dropped back into its original position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the column the draggable item was originally in
    const sourceColumn = taskState.columns[source.droppableId];

    // Find the column the draggable item was dropped in
    const destinationColumn = taskState.columns[destination.droppableId];

    // Remove the draggable item from the source column taskIds array
    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(source.index, 1);

    // Add the draggable item to the destination column taskIds array
    const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
    newDestinationTaskIds.splice(destination.index, 0, draggableId);

    // Update the state with the new column and task information
    setTaskState({
      ...taskState,
      columns: {
        ...taskState.columns,
        [sourceColumn.id]: {
          ...sourceColumn,
          taskIds: newSourceTaskIds,
        },
        [destinationColumn.id]: {
          ...destinationColumn,
          taskIds: newDestinationTaskIds,
        }
      }
    });
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {taskState.columnOrder.map((columnId) => {
          const column = taskState.columns[columnId];
          return (
            <div className="kanban-column" key={column.id}>
              <h2>{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {column.taskIds.map((taskId, index) => {
                      const task = taskState.tasks[taskId];
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div>{task.title}</div>
                              <div>{task.description}</div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;