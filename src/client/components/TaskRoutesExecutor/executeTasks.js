import runTasksForLocation from 'shared/routeTasks/runTasksForLocation';

function executeTasks(location, dispatch) {
  const tasksToExecute = ['deferredData'];

  if (window && window.__APP_STATE__) {
    tasksToExecute.unshift('prefetchData');
    delete window.__APP_STATE__;
  }
  const executingTasks = runTasksForLocation(location, tasksToExecute, { dispatch });

  if (executingTasks) {
    executingTasks.then(({ routes }) => { // eslint-disable-line
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Finished route tasks', routes); // eslint-disable-line no-console
      // }
    });
  }
}

export default executeTasks;
