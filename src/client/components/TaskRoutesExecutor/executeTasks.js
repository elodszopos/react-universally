import runTasksForLocation from 'shared/routeTasks/runTasksForLocation';

function executeTasks(location, dispatch, state) {
  const tasksToExecute = ['deferredData'];

  if (window && window.__APP_STATE__) {
    delete window.__APP_STATE__;
  } else {
    tasksToExecute.unshift('prefetchData');
  }

  const executingTasks = runTasksForLocation(location, tasksToExecute, { dispatch, state });

  if (executingTasks) {
    executingTasks.then(({ routes }) => { // eslint-disable-line
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Finished route tasks', routes); // eslint-disable-line no-console
      // }
    });
  }
}

export default executeTasks;
