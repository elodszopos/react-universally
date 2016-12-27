import matchRoutesToLocation from 'react-router-addons-routes/matchRoutesToLocation';

import taskRoutes from './taskRoutes';

function runTasksForLocation(location, taskNames, locals) {
  const routes = taskRoutes(locals);

  const { matchedRoutes, params } = matchRoutesToLocation(routes, location);

  if (matchedRoutes.length === 0) {
    return undefined;
  }

  const resolveTasks = taskName => Promise.all(
    matchedRoutes
    .filter(tasksRoute => tasksRoute[taskName])
    .map(tasksRoute => tasksRoute[taskName](params)),
  );

  return Promise.all(taskNames.map(resolveTasks))
    .then(results => ({ routes: matchedRoutes, results }));
}

export default runTasksForLocation;
