const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, github }) {
  const { payload, ref, workflow, eventName } = github.context;
  const { owner, repo } = context.repo;
  const event = eventName;
  
  let branch = event === 'pull_request' ? payload.pull_request.head.ref : ref.replace('refs/heads/', '');

  console.log('Context', github.context);
  console.log('Workflow run', payload.workflow_run);

  let sha = event === 'pull_request' ? payload.pull_request.head.sha : github.context.sha;

  if (payload.workflow_run) {
    branch = payload.workflow_run.head_branch;
    sha = payload.workflow_run.head_sha;
  }

  const runId = parseInt(process.env.GITHUB_RUN_ID, 10);

  const referenceLink =
    event === 'pull_request'
      ? {
          title: 'Pull Request',
          value: `<${payload.pull_request.html_url} | ${payload.pull_request.title}>`,
          short: true,
        }
      : {
          title: 'Branch',
          value: `<https://github.com/${owner}/${repo}/commit/${sha} | ${branch}>`,
          short: true,
        };

  return [
    {
      color,
      fields: [
        {
          title: 'Repo',
          value: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
          short: true,
        },
        {
          title: 'Workflow',
          value: `<https://github.com/${owner}/${repo}/actions/runs/${runId} | ${workflow}>`,
          short: true,
        },
        {
          title: 'Status',
          value: status,
          short: true,
        },
        referenceLink,
        {
          title: 'Event',
          value: event,
          short: true,
        },
      ],
      footer_icon: 'https://github.githubassets.com/favicon.ico',
      footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
      ts: Math.floor(Date.now() / 1000),
    },
  ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
