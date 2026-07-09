// Ready-made seed content so the directory renders out of the box. Your engineer
// edits/removes these from the admin console (or by editing the JSON store). On a
// fresh install this is what appears until the admin changes it.

export function defaultAgents() {
  return [
    { id: 'a1', name: 'City GPT — Finance', description: 'General-purpose assistant tuned for the Finance dept.', url: 'https://agents.city.gov/citygpt-finance', category: 'Finance', group: 'City GPT' },
    { id: 'a13', name: 'City GPT — HR', description: 'General-purpose assistant tuned for HR questions.', url: 'https://agents.city.gov/citygpt-hr', category: 'Records & Services', group: 'City GPT' },
    { id: 'a14', name: 'City GPT — Public Works', description: 'General-purpose assistant for Public Works staff.', url: 'https://agents.city.gov/citygpt-publicworks', category: 'Planning & Infrastructure', group: 'City GPT' },
    { id: 'a2', name: 'City Agent Insights', description: 'Query the city data warehouse in plain English.', url: 'https://agents.city.gov/insights', category: 'Data & Analytics', group: 'City Agents' },
    { id: 'a3', name: 'City Agent Pulse', description: 'Live KPI dashboards for department leads.', url: 'https://agents.city.gov/pulse', category: 'Data & Analytics', group: 'City Agents' },
    { id: 'a4', name: 'City Agent ARIA', description: 'Handles ISTM service requests and reporting.', url: 'https://agents.city.gov/aria', category: 'Records & Services', group: 'City Agents' },
    { id: 'a5', name: 'City Agent Civic', description: 'Tracks citizen 311 requests end to end.', url: 'https://agents.city.gov/civic', category: 'Records & Services', group: 'City Agents' },
    { id: 'a6', name: 'City Agent Atlas', description: 'Permits, zoning and GIS lookups in one place.', url: 'https://agents.city.gov/atlas', category: 'Planning & Infrastructure', group: 'City Agents' },
    { id: 'a7', name: 'City Agent Compass', description: 'Guides applicants through permit wayfinding.', url: 'https://agents.city.gov/compass', category: 'Planning & Infrastructure', group: 'City Agents' },
    { id: 'a8', name: 'City Agent Ledger', description: 'Budget tracking and finance reporting assistant.', url: 'https://agents.city.gov/ledger', category: 'Finance', group: 'City Agents' },
    { id: 'a9', name: 'City Agent Payroll', description: 'Answers payroll and benefits questions fast.', url: 'https://agents.city.gov/payroll', category: 'Finance', group: 'City Agents' },
    { id: 'a10', name: 'City Agent Sentinel', description: 'Safety alerts and compliance monitoring.', url: 'https://agents.city.gov/sentinel', category: 'Public Safety', group: 'City Agents' },
    { id: 'a11', name: 'City Agent Watch', description: 'Real-time incident monitoring for dispatch.', url: 'https://agents.city.gov/watch', category: 'Public Safety', group: 'City Agents' },
    { id: 'a12', name: 'City Agent Relay', description: 'Drafts and routes inter-department messages.', url: 'https://agents.city.gov/relay', category: 'Communications', group: 'City Agents' }
  ];
}

export function defaultTicker() {
  return [
    { id: 't1', text: '12 city agents now live in the hub' },
    { id: 't2', text: 'Budget Season Toolkit — new templates available' },
    { id: 't3', text: 'Employee Town Hall · Thursday 10am' },
    { id: 't4', text: 'Submit feedback to shape the next agent' }
  ];
}

export function defaultAds() {
  return [
    { id: 'ad1', headline: 'Budget Season Toolkit', description: 'Templates and guides for department budget requests.', url: 'https://intranet.city.gov/budget-toolkit' },
    { id: 'ad2', headline: 'New Agent: City Agent Pulse', description: 'Live KPI dashboards, now available in the hub.', url: 'https://intranet.city.gov/pulse-launch' },
    { id: 'ad3', headline: 'Share Your Feedback', description: 'Help shape the next agent added to the hub.', url: 'https://intranet.city.gov/feedback' }
  ];
}

export function defaultGroups() {
  return [
    { id: 'g1', name: 'City GPT' },
    { id: 'g2', name: 'City Agents' }
  ];
}

export function defaultCategories() {
  return [
    { id: 'c1', name: 'Data & Analytics', color: 'oklch(62% 0.14 45)' },
    { id: 'c2', name: 'Records & Services', color: 'oklch(62% 0.13 210)' },
    { id: 'c3', name: 'Planning & Infrastructure', color: 'oklch(62% 0.13 145)' },
    { id: 'c4', name: 'Finance', color: 'oklch(60% 0.14 295)' },
    { id: 'c5', name: 'Public Safety', color: 'oklch(60% 0.16 25)' },
    { id: 'c6', name: 'Communications', color: 'oklch(62% 0.14 335)' }
  ];
}
