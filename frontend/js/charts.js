
const ChartsEmbedSDK = window.ChartsEmbedSDK;

const sdk = new ChartsEmbedSDK({
  baseUrl: 'https://charts.mongodb.com/charts-statestreet-tjygl',
});

// embed a dashboard
const dashboard = sdk.createDashboard({
  dashboardId: '62d5c22a-32ba-4893-8f4f-1d25de205c6a',
});

// render the chart into a container
dashboard
  .render(document.getElementById('dashboard'))
  .catch(() => window.alert('Dashboard failed to initialise'));